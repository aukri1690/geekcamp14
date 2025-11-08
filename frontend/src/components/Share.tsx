'use client'

import { Card, Flex, Image, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "next/navigation"; // URLパラメータ取得用

const Share = () => {
   const params = useParams();
   const { card_id } = params; // URLの /share/[card_id] で受け取る想定
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
  });
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`/api/cards/view/${card_id}`);
        const data = res.data;
        if (!data) return;
        setForm(prev => ({
          ...prev,
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
        }));
        if (data.photo_url) {
          setPreview(data.photo_url);
        }
      } catch (err: any) {
        console.error("カード取得エラー:", err);
      }
    };

    fetchCard();

    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview)
    }
  }, [])

  return (
    <>
      <Flex justify='center' align='center' minH='100vh' direction='column' gap={6}>
        <Card.Root variant='elevated'>
          <Card.Body>
            <Flex justify='center' direction='column' mb={6}>
              <Image
                mx="auto"
                boxSize='100px'
                objectFit='cover'
                borderRadius='full'
                src={preview ?? "/initial_green_icon.png"}
                alt="Profile image"
              />
            </Flex>
            <Flex direction='row' justify='center' mt={-4} mb={4} gap={2}>
              {/*受け取ったユーザーネームを{}に代入する処理が必要*/}
              <Link href='https://www.instagram.com/aukri1690/'>
                <Image
                  boxSize='24px'
                  src='/instagram_icon.svg'
                  mt={2}
                />
              </Link>
            </Flex>
            <Flex direction='row' gap={8} mb={4}>
              <Flex direction='column'>
                <Text fontSize='sm' color='gray.500'>名前</Text>
                <Text fontSize='md'>{form.name || "未設定"}</Text>
              </Flex>
              <Flex direction='column'>
                <Text fontSize='sm' color='gray.500'>ふりがな</Text>
                <Text fontSize='md'>{form.furigana || "未設定"}</Text>
              </Flex>
            </Flex>
            <Flex direction='row' gap={8} mb={4}>
              <Flex direction='column'>
                <Text fontSize='sm' color='gray.500'>項目1</Text>
                <Text fontSize='md'>{form.job || form.student || form.birthday || form.goal || form.hobby || form.interest || form.qualification || "未設定"}</Text>
              </Flex>
              <Flex direction='column'>
                <Text fontSize='sm' color='gray.500'>項目2</Text>
                <Text fontSize='md'>{form.interest || form.hobby || form.goal || form.qualification || form.birthday || "未設定"}</Text>
              </Flex>
            </Flex>
            <Flex direction='column' mt={2}>
              <Text fontSize='sm' color='gray.500'>自由記述</Text>
              <Text fontSize='md'>{form.free_text || "なし"}</Text>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Flex>
    </>
  );
};

export default Share;