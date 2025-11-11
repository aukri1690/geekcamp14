'use client';

import { Card, Flex, Image, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
    selected1: "",
    selected2: "",
  });

  const [preview, setPreview] = useState<string | null>(null);

  // ✅ 表示ラベル → DBフィールド の対応表
  const fieldMap: Record<string, keyof typeof form> = {
    "誕生日": "birthday",
    "職種": "job",
    "学年": "student",
    "目標": "goal",
    "趣味": "hobby",
    "興味": "interest",
    "保有資格": "qualification",
  };

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
          selected1: data.selected1 ?? "",
          selected2: data.selected2 ?? "",
        });

        if (data.photo_url) setPreview(data.photo_url);
      } catch (err) {
        console.error("カード取得エラー:", err);
      }
    };
    fetchCard();
  }, [card_id]);

  // 項目1・項目2の表示値（selected1, selected2に基づく）
  const item1 =
    form.selected1 && fieldMap[form.selected1]
      ? form[fieldMap[form.selected1]] || ""
      : "";
  const item2 =
    form.selected2 && fieldMap[form.selected2]
      ? form[fieldMap[form.selected2]] || ""
      : "";

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Flex justify="center" align="center" minH="100vh" direction="column" gap={6}>
      <Card.Root variant="elevated"w="100%"maxW="270px"mx="auto" >
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

          {/* SNSリンク */}
          {form.sns_link && (
            <Flex justify="center" mb={4}>
              <Link
                href={
                  form.sns_link.startsWith("http")
                    ? form.sns_link
                    : `https://www.instagram.com/${form.sns_link}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image boxSize="24px" src="/instagram_icon.svg" alt="Instagram" />
              </Link>
            </Flex>
          )}

          {/* 名前・ふりがな */}
          <Flex direction={{ base: "column", md: "row" }} gap={8} mb={4}>
            <Flex direction="column">
              <Text fontSize="sm" color="gray.500">
                名前
              </Text>
              <Text fontSize="md">{form.name || "未設定"}</Text>
            </Flex>
            <Flex direction="column">
              <Text fontSize="sm" color="gray.500">
                ふりがな
              </Text>
              <Text fontSize="md">{form.furigana || "未設定"}</Text>
            </Flex>
          </Flex>

          {/* ✅ 項目1・2（selected1 / selected2反映版） */}
          <Flex direction={{ base: "column", md: "row" }} gap={8} mb={4}>
            <Flex direction="column">
              <Text fontSize="sm" color="gray.500">
                {form.selected1 || "項目1"}
              </Text>
              <Text fontSize="md">{item1 || "未設定"}</Text>
            </Flex>
            <Flex direction="column">
              <Text fontSize="sm" color="gray.500">
                {form.selected2 || "項目2"}
              </Text>
              <Text fontSize="md">{item2 || "未設定"}</Text>
            </Flex>
          </Flex>

          {/* 自由記述 */}
          <Flex direction="column" mt={2}>
            <Text fontSize="sm" color="gray.500">
              自由記述
            </Text>
            <Text fontSize="md">{form.free_text || "なし"}</Text>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
};

export default Share;
