'use client'

import { Button, Card, Flex, IconButton, Input, Image, Menu, Portal, Text, FileUpload } from "@chakra-ui/react";
import React, { useEffect, useState } from "react"
import axios from "axios";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const CreateSelfIntroductionCard = () => {
  const router = useRouter();

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
  const [file, setFile] = useState<File | null>(null);
  const [selected1, setSelected1] = useState<string>('項目1▽')
  const [selected2, setSelected2] = useState<string>('項目2▽')

  // 🟢 項目1入力ハンドラ
  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const fieldMap: Record<string, keyof typeof form> = {
      "誕生日": "birthday", // バックにある場合
      "職種": "job",
      "学年": "student",
      "目標": "goal",
      "趣味": "hobby",
      "興味": "interest",
      "保有資格": "qualification",
    };

    const key = fieldMap[selected1];
    if (key) {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };
  // 🟢 入力値を更新
  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 選択項目 → form のキーに変換
    const fieldMap: Record<string, keyof typeof form> = {
      "誕生日": "birthday",
      "職種": "job",
      "学年": "student",
      "目標": "goal",
      "趣味": "hobby",
      "興味": "interest",
      "保有資格": "qualification",
    };

    const key = fieldMap[selected2];
    if (key) {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  // 入力変更ハンドラ
  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // カード作成 + 写真アップロード
  const handleCreateCard = async () => {
    // ✅ 送信データ整形
    const payload = {
      name: form.name,
      furigana: form.furigana,
      job: form.job || null,
      student: form.student || null,
      interest: form.interest || null,
      goal: form.goal || null,
      hobby: form.hobby || null,
      qualification: form.qualification || null,
      sns_link: null, // 現状フォーム未対応なのでnull
      free_text: form.free_text || null,
      birthday: form.birthday || null, // "YYYY-MM-DD"形式 or null
    };

    try {
      // 1️⃣ カード作成リクエスト（Cookie送信を許可）
      const res = await axios.post("/api/create-card", payload, {
        withCredentials: true, // ← 重要！
      });

      const { card_id } = res.data;
      alert("カード作成に成功しました！");

      router.push("/edit");

      // 2️⃣ 写真アップロード（Cookie送信を許可）
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post(`/api/upload-photo?card_id=${card_id}`, formData, {
          withCredentials: true, // ← 重要！
        });
        alert("画像アップロードが完了しました！");
      }
    } catch (err: any) {
      console.error(err);
      alert(`カード作成に失敗しました。\n${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <>
      <Flex justify='center' align='center' minH='90vh' direction='column' gap={20}>
        <Card.Root variant='elevated'>
          <Card.Body>
            <Flex justify='center' direction='column' mb={6}>
              <FileUpload.Root accept={["image/png", "image/jpeg", "image/webp"]}>
                <FileUpload.HiddenInput
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setPreview(url)
                    }
                  }}
                />
                <FileUpload.Trigger asChild>
                  <Image
                    mx="auto"
                    boxSize='100px'
                    objectFit='cover'
                    borderRadius='full'
                    src={preview ?? "/initial_green_icon.png"}
                    alt="Profile image"
                    cursor="pointer"
                    transition="transform 0.15s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                </FileUpload.Trigger>
              </FileUpload.Root>
            </Flex>
            <Flex direction='row' justify='center' mt={-4} mb={4} gap={2}>
              <Image
                boxSize='24px'
                src='/instagram_icon.svg'
                mt={2}
              />
              <Input variant='flushed' w='100px' css={{ "--focus-color": "teal" }} placeholder='ユーザーネーム'></Input>
            </Flex>
            <Flex direction='row' gap={8}>
              <Flex direction='column'>
                <Text fontSize='sm'>名前</Text>
                <Input variant='flushed' w='120px' css={{ "--focus-color": "teal" }} mb={3} onChange={e => handleChange("name", e.target.value)}></Input>
              </Flex>
              <Flex direction='column'>
                <Text fontSize='sm'>ふりがな</Text>
                <Input variant='flushed' w='120px' css={{ "--focus-color": "teal" }} onChange={e => handleChange("furigana", e.target.value)}></Input>
              </Flex>
            </Flex>
            <Flex direction='row' gap={8}>
              <Flex align='start' mt={2} ml={-4} direction='column'>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">
                      {selected1}
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="birthday" onClick={() => setSelected1('誕生日')}>誕生日</Menu.Item>
                        <Menu.Item value="occupation" onClick={() => setSelected1('職種')}>職種</Menu.Item>
                        <Menu.Item value="student" onClick={() => setSelected1('学年')}>学年</Menu.Item>
                        <Menu.Item value="goal" onClick={() => setSelected1('目標')}>目標</Menu.Item>
                        <Menu.Item value="hobby" onClick={() => setSelected1('趣味')}>趣味</Menu.Item>
                        <Menu.Item value="interest" onClick={() => setSelected1('興味')}>興味</Menu.Item>
                        <Menu.Item value="qualification" onClick={() => setSelected1('保有資格')}>保有資格</Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <Input variant='flushed' w='120px' ml={4} css={{ "--focus-color": "teal" }} onChange={handleInputChange1}></Input>
              </Flex>
              <Flex align='start' mt={2} ml={-4} direction='column'>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">
                      {selected2}
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="birthday" onClick={() => setSelected2('誕生日')}>誕生日</Menu.Item>
                        <Menu.Item value="occupation" onClick={() => setSelected2('職種')}>職種</Menu.Item>
                        <Menu.Item value="student" onClick={() => setSelected2('学年')}>学年</Menu.Item>
                        <Menu.Item value="goal" onClick={() => setSelected2('目標')}>目標</Menu.Item>
                        <Menu.Item value="hobby" onClick={() => setSelected2('趣味')}>趣味</Menu.Item>
                        <Menu.Item value="interest" onClick={() => setSelected2('興味')}>興味</Menu.Item>
                        <Menu.Item value="qualification" onClick={() => setSelected2('保有資格')}>保有資格</Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <Input variant='flushed' w='120px' ml={4} css={{ "--focus-color": "teal" }} onChange={handleInputChange2}></Input>
              </Flex>
            </Flex>
            <Flex direction='column' mt={4}>
              <Text fontSize='sm'>自由記述</Text>
              <Input variant='flushed' w='270px' css={{ "--focus-color": "teal" }} mb={3} onChange={e => handleChange("free_text", e.target.value)}></Input>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Flex>
      <Flex justify='center' align='center' direction='row' gap={6}>
        <Flex align='center' direction='column'>
          <IconButton variant='ghost' size='2xl' mb={-4} onClick={handleCreateCard}>
            <FaRegPenToSquare color='teal'/>
          </IconButton>
          <Text fontSize='12px' fontWeight='bold' color='teal'>保存</Text>
        </Flex>
        <Flex align='center' direction='column'>
          <IconButton variant='ghost' size='2xl' mb={-4}>
            <FaRegShareFromSquare color='teal' />
          </IconButton>
          <Text fontSize='12px' fontWeight='bold' color='teal'>共有</Text>
        </Flex>
      </Flex>
    </>
  );
};

export default CreateSelfIntroductionCard;