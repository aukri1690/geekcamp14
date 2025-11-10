'use client';

import { Card, Flex, Image, Link, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const Share = () => {
  const { card_id } = useParams();

  const [form, setForm] = useState({
    name: "",
    furigana: "",
    birthday: "",
    job: "",
    student: "",
    goal: "",
    hobby: "",
    interest: "",
    qualification: "",
    free_text: "",
    sns_link: "",
  });

  const [preview, setPreview] = useState<string | null>(null);

  const fieldPriority: (keyof typeof form)[] = [
    "birthday", "job", "student", "goal", "hobby", "interest", "qualification"
  ];

  const [item1, item2] = useMemo(() => {
    const filled = fieldPriority.filter(key => form[key]);
    return [filled[0] ? form[filled[0]] : null, filled[1] ? form[filled[1]] : null];
  }, [form]);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:8000";
        const res = await axios.get(`${API_BASE_URL}/api/cardlink/cards/view/${card_id}`);
        const data = res.data;
        if (!data) return;

        setForm({
          name: data.name ?? "",
          furigana: data.furigana ?? "",
          birthday: data.birthday ?? "",
          job: data.job ?? "",
          student: data.student ?? "",
          goal: data.goal ?? "",
          hobby: data.hobby ?? "",
          interest: data.interest ?? "",
          qualification: data.qualification ?? "",
          free_text: data.free_text ?? "",
          sns_link: data.sns_link ?? "",
        });

        if (data.photo_url) setPreview(data.photo_url);
      } catch (err) {
        console.error("カード取得エラー:", err);
      }
    };
    fetchCard();
  }, [card_id]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Flex justify="center" align="center" minH="100vh" direction="column" gap={6}>
      <Card.Root variant="elevated">
        <Card.Body>
          <Flex justify="center" direction="column" mb={6}>
            <Image
              mx="auto"
              boxSize="100px"
              borderRadius="full"
              objectFit="cover"
              src={preview ?? "/initial_green_icon.png"}
              alt="Profile image"
              onError={(e) => (e.currentTarget.src = "/initial_green_icon.png")}
            />
          </Flex>

          {form.sns_link && (
            <Flex justify="center" mb={4}>
              <Link
                href={form.sns_link.startsWith("http") ? form.sns_link : `https://www.instagram.com/${form.sns_link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image boxSize="24px" src="/instagram_icon.svg" alt="Instagram" />
              </Link>
            </Flex>
          )}

          <Flex direction={{ base: "column", md: "row" }} gap={8} mb={4}>
            <Flex direction="column">
              <Text fontSize="sm" color="gray.500">名前</Text>
              <Text fontSize="md">{form.name || "未設定"}</Text>
            </Flex>
            <Flex direction="column">
              <Text fontSize="sm" color="gray.500">ふりがな</Text>
              <Text fontSize="md">{form.furigana || "未設定"}</Text>
            </Flex>
          </Flex>

          <Flex direction={{ base: "column", md: "row" }} gap={8} mb={4}>
            <Flex direction="column">
              <Text fontSize="sm" color="gray.500">項目1</Text>
              <Text fontSize="md">{item1 || "未設定"}</Text>
            </Flex>
            <Flex direction="column">
              <Text fontSize="sm" color="gray.500">項目2</Text>
              <Text fontSize="md">{item2 || "未設定"}</Text>
            </Flex>
          </Flex>

          <Flex direction="column" mt={2}>
            <Text fontSize="sm" color="gray.500">自由記述</Text>
            <Text fontSize="md">{form.free_text || "なし"}</Text>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
};

export default Share;
