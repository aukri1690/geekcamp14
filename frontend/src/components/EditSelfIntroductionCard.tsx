'use client'

import { Button, Card, FileUpload, Flex, IconButton, Image, Input, Menu, Portal, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { FaLink, FaRegCircleCheck, FaRegPenToSquare } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

const EditSelfIntroductionCard = () => {
  const router = useRouter();
  const [shareAlert, setShareAlert] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [selected1, setSelected1] = useState<string>('項目1▽')
  const [selected2, setSelected2] = useState<string>('項目2▽')
  const [cardId, setCardId] = useState<string>("") // 編集対象カードID
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
    sns_link:"",
  })

  // 🟢 フィールドマッピング
  const fieldMap: Record<string, keyof typeof form> = {
    "誕生日": "birthday",
    "職種": "job",
    "学年": "student",
    "目標": "goal",
    "趣味": "hobby",
    "興味": "interest",
    "保有資格": "qualification",
  }
useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`/api/get-card`, { withCredentials: true })
        const card = res.data.card
        setForm(card)
        setCardId(card.card_id)
        if (card.photo_url) setPreview(card.photo_url)

        // ✅ 保存済みの選択状態を復元（カードIDが必要なのでここで実行）
        const saved1 = localStorage.getItem(`selected1_${card.card_id}`)
        const saved2 = localStorage.getItem(`selected2_${card.card_id}`)
        if (saved1) setSelected1(saved1)
        if (saved2) setSelected2(saved2)

        // 🟢 保存がなければ、値が存在するフィールドから自動選択
        if (!saved1 || !saved2) {
          const filledFields = Object.entries(fieldMap)
            .filter(([_, key]) => card[key])
            .map(([label]) => label)
          if (!saved1 && filledFields.length > 0) setSelected1(filledFields[0])
          if (!saved2 && filledFields.length > 1) setSelected2(filledFields[1])
        }
      } catch (err) {
        console.error("カード取得失敗:", err)
      }
    }
    fetchCard()
  }, [])
  // -----------------------
  // 画像取得
  // -----------------------
  useEffect(() => {
    const fetchPhoto = async () => {
      if (!cardId) return;
      try {
        const res = await axios.get(`/api/get-photo`, {
        params: { card_id: cardId }, // ← cardId は useState などで保持している値
        });
        setPreview(res.data.photo_url ?? "/initial_green_icon.png");
      } catch (err) {
        console.error("画像取得失敗:", err);
        setPreview("/initial_green_icon.png");
      }
    };
    fetchPhoto();
  }, [cardId]);
   // 🟢 選択状態を localStorage に保存
  const handleSelect1 = (label: string) => {
    setSelected1(label)
    if (cardId) localStorage.setItem(`selected1_${cardId}`, label)
  }
  const handleSelect2 = (label: string) => {
    setSelected2(label)
    if (cardId) localStorage.setItem(`selected2_${cardId}`, label)
  }
  // 🟢 項目1・2入力処理
  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = fieldMap[selected1]
    if (key) setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }
  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = fieldMap[selected2]
    if (key) setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  // 🟢 通常入力（名前、ふりがな、自由記述など）
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }
 // -----------------------
  // カード更新
  // -----------------------
  const handleUpdateCard = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== "" && v !== null)
      )

      // カード本体更新
      await axios.patch(`/api/update-card?card_id=${cardId}`, payload, { withCredentials: true });

      // 画像アップロード
      if (file) {
        const formData = new FormData()
        formData.append("file", file)
         const res = await axios.post(`/api/upload-card/${cardId}/photo`, formData, {
        withCredentials: true,
      })
        if (res.data.photo_url) setPreview(res.data.photo_url)
      }

      alert("カードを更新しました！")
    } catch (err: any) {
      console.error(err)
      alert(`更新に失敗しました: ${err.response?.data?.error || err.message}`)
    }
  }

  // -----------------------
  // 画像URLのクリーンアップ
  // -----------------------
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])


  return (
    <>
      <Flex justify='center' align='center' minH='90vh' direction='column' gap={20} >
        <Card.Root variant='elevated'>
          <Card.Body>
            <Flex justify='center' direction='column' mb={6}>
              <FileUpload.Root accept={["image/png", "image/jpeg", "image/webp"]}>
                <FileUpload.HiddenInput
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFile(file)
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
              <Input variant='flushed' w='100px' css={{ "--focus-color": "teal" }} placeholder='ユーザーネーム' value={form.sns_link??""} onChange={e => handleChange("sns_link", e.target.value)}></Input>
            </Flex>
            <Flex direction='row' gap={8}>
              <Flex direction='column'>
                <Text fontSize='sm'>名前</Text>
                <Input variant='flushed' w='120px' css={{ "--focus-color": "teal" }} mb={3} value={form.name} onChange={(e) => handleChange("name", e.target.value)}></Input>
              </Flex>
              <Flex direction='column'>
                <Text fontSize='sm'>ふりがな</Text>
                <Input variant='flushed' w='120px' css={{ "--focus-color": "teal" }} value={form.furigana} onChange={(e) => handleChange("furigana", e.target.value)}></Input>
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
                        <Menu.Item value="job" onClick={() => setSelected1('職種')}>職種</Menu.Item>
                        <Menu.Item value="student" onClick={() => setSelected1('学年')}>学年</Menu.Item>
                        <Menu.Item value="goal" onClick={() => setSelected1('目標')}>目標</Menu.Item>
                        <Menu.Item value="hobby" onClick={() => setSelected1('趣味')}>趣味</Menu.Item>
                        <Menu.Item value="interest" onClick={() => setSelected1('興味')}>興味</Menu.Item>
                        <Menu.Item value="qualifications" onClick={() => setSelected1('保有資格')}>保有資格</Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <Input variant='flushed' w='120px' ml={4} css={{ "--focus-color": "teal" }} value={fieldMap[selected1] ? form[fieldMap[selected1]] || "" : ""} onChange={handleInputChange1}></Input>
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
                        <Menu.Item value="job" onClick={() => setSelected2('職種')}>職種</Menu.Item>
                        <Menu.Item value="student" onClick={() => setSelected2('学年')}>学年</Menu.Item>
                        <Menu.Item value="goal" onClick={() => setSelected2('目標')}>目標</Menu.Item>
                        <Menu.Item value="hobby" onClick={() => setSelected2('趣味')}>趣味</Menu.Item>
                        <Menu.Item value="interest" onClick={() => setSelected2('興味')}>興味</Menu.Item>
                        <Menu.Item value="qualifications" onClick={() => setSelected2('保有資格')}>保有資格</Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <Input variant='flushed' w='120px' ml={4} css={{ "--focus-color": "teal" }} value={fieldMap[selected2] ? form[fieldMap[selected2]] || "" : ""} onChange={handleInputChange2}></Input>
              </Flex>
            </Flex>
            <Flex direction='column' mt={4}>
              <Text fontSize='sm'>自由記述</Text>
              <Input variant='flushed' w='270px' css={{ "--focus-color": "teal" }} mb={3} value={form.free_text ?? ""} onChange={(e) => handleChange("free_text", e.target.value)}></Input>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Flex>
      <Flex justify='center' align='center' direction='row' gap={6}>
        <Flex align='center' direction='column'>
          <IconButton variant='ghost' size='2xl' mb={-4} onClick={handleUpdateCard}>
            <FaRegPenToSquare color='teal' />
          </IconButton>
          <Text fontSize='12px' fontWeight='bold' color='teal'>保存</Text>
        </Flex>

        {shareAlert ? (
          <Flex align='center' direction='column'>
            <IconButton variant='ghost' size='2xl' mb={-4} onClick={() => setShareAlert(!shareAlert)}>
              <FaRegCircleCheck color='teal' />
            </IconButton>
            <Text fontSize='12px' fontWeight='bold' color='teal'>完了</Text>
          </Flex>
        ) : (
          <Flex align='center' direction='column'>
            <IconButton variant='ghost' size='2xl' mb={-4} onClick={() => setShareAlert(!shareAlert)}>
              <FaLink color='teal' />
            </IconButton>
            <Text fontSize='12px' fontWeight='bold' color='teal'>共有</Text>
          </Flex>
        )}
        <Flex align='center' direction='column'>
          <IconButton
            variant='ghost'
            size='2xl'
            mb={-4}
            onClick={async () => {
              try {
                await axios.post("/api/logout", {}, { withCredentials: true });
                alert("ログアウトしました");
                router.push("/"); // ✅ 自動遷移
              } catch (err: any) {
                alert("ログアウトに失敗しました");
                console.error(err);
              }
            }}
          >
            <FiLogOut color='teal' />
          </IconButton>
          <Text fontSize='12px' fontWeight='bold' color='teal'>ログアウト</Text>
        </Flex>

      </Flex>
    </>
  );
};

export default EditSelfIntroductionCard;