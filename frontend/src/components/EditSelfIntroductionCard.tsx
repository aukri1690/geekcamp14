'use client'

import { Button, Card, Clipboard, FileUpload, Flex, IconButton, Image, Input, Menu, Portal, Text } from "@chakra-ui/react"
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
    sns_link: "",
  })

  // フィールドマッピング
  const fieldMap: Record<string, keyof typeof form> = {
    "誕生日": "birthday",
    "職種": "job",
    "学年": "student",
    "目標": "goal",
    "趣味": "hobby",
    "興味": "interest",
    "保有資格": "qualification",
  }

  // -----------------------
  // カード情報取得
  // -----------------------
  const fetchCard = async () => {
    try {
      const res = await axios.get(`/api/get-card`, { withCredentials: true });
      const card = res.data.card;
      setForm(card);
      setCardId(card.card_id);

      if (card.photo_url) setPreview(card.photo_url);

      // ✅ DBに保存された selected1, selected2 を反映
      if (card.selected1) setSelected1(card.selected1);
      if (card.selected2) setSelected2(card.selected2);

      // DBになければ、従来の自動設定ロジックを使用
      if (!card.selected1 || !card.selected2) {
        const saved1 = localStorage.getItem(`selected1_${card.card_id}`);
        const saved2 = localStorage.getItem(`selected2_${card.card_id}`);
        setSelected1(saved1 || Object.keys(fieldMap).find(k => card[fieldMap[k]]) || "項目1▽");
        setSelected2(saved2 || Object.keys(fieldMap).filter(k => card[fieldMap[k]] && k !== (saved1 || ""))[0] || "項目2▽");
      }

    } catch (err) {
      console.error("カード取得失敗:", err);
    }
  }

  useEffect(() => { fetchCard() }, []);

  // -----------------------
  // 画像取得
  // -----------------------
  useEffect(() => {
    const fetchPhoto = async () => {
      if (!cardId) return;
      try {
        const res = await axios.get(`/api/get-photo`, { params: { card_id: cardId } });
        setPreview(res.data.photo_url ?? "/initial_green_icon.png");
      } catch (err) {
        console.error("画像取得失敗:", err);
        setPreview("/initial_green_icon.png");
      }
    };
    fetchPhoto();
  }, [cardId]);

  // 選択状態保存
  const handleSelect1 = (label: string) => {
    setSelected1(label);
    if (cardId) localStorage.setItem(`selected1_${cardId}`, label);
  }
  const handleSelect2 = (label: string) => {
    setSelected2(label);
    if (cardId) localStorage.setItem(`selected2_${cardId}`, label);
  }

  // 項目1・2入力処理
  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = fieldMap[selected1];
    if (key) setForm(prev => ({ ...prev, [key]: e.target.value }));
  }
  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = fieldMap[selected2];
    if (key) setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  // 通常入力
  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  // -----------------------
  // カード更新（★ 修正版）
  // -----------------------
  const handleUpdateCard = async () => {
    try {
      // ✅ DBに保存するため selected1, selected2 をpayloadに含める
      const payload = {
        ...Object.fromEntries(Object.entries(form).filter(([_, v]) => v !== "" && v !== null)),
        selected1,
        selected2,
      };

      // カード本体更新
      await axios.patch(`/api/update-card?card_id=${cardId}`, payload, { withCredentials: true });

      // 画像アップロード
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.put(`/api/upload-photo?card_id=${cardId}`, formData, { withCredentials: true });
        if (res.data.photo_url) setPreview(res.data.photo_url);
      }

      // ✅ 更新後に最新カードを取得
      await fetchCard();

      alert("カードを更新しました！");
    } catch (err: any) {
      console.error(err);
      alert(`更新に失敗しました: ${err.response?.data?.error || err.message}`);
    }
  }

  // 画像URLクリーンアップ
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview]);

  return (
    <>
      <Flex justify='center' align='center' minH='90vh' direction='column' gap={20}  >
        <Card.Root variant='elevated'>
          <Card.Body>
            <Flex justify='center' direction='column' mb={6}>
              <FileUpload.Root accept={["image/png", "image/jpeg", "image/webp"]}>
                <FileUpload.HiddenInput
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      const url = URL.createObjectURL(file);
                      setPreview(url);
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

            {/* SNSリンク */}
            <Flex direction='row' justify='center' mt={-4} mb={4} gap={2}>
              <Image boxSize='24px' src='/instagram_icon.svg' mt={2} />
              <Input variant='flushed' w='100px' css={{ "--focus-color": "teal" }} placeholder='ユーザーネーム' value={form.sns_link??""} onChange={e => handleChange("sns_link", e.target.value)} />
            </Flex>

            {/* 名前・ふりがな */}
            <Flex direction='row' gap={8}>
              <Flex direction='column'>
                <Text fontSize='sm'>名前</Text>
                <Input variant='flushed' w='120px' css={{ "--focus-color": "teal" }} mb={3} value={form.name} onChange={e => handleChange("name", e.target.value)} />
              </Flex>
              <Flex direction='column'>
                <Text fontSize='sm'>ふりがな</Text>
                <Input variant='flushed' w='120px' css={{ "--focus-color": "teal" }} value={form.furigana} onChange={e => handleChange("furigana", e.target.value)} />
              </Flex>
            </Flex>

            {/* 項目1・2 */}
            <Flex direction='row' gap={8}>
              {[selected1, selected2].map((selected, idx) => {
                const handleSelect = idx === 0 ? handleSelect1 : handleSelect2;
                const handleInputChange = idx === 0 ? handleInputChange1 : handleInputChange2;
                return (
                  <Flex key={idx} align='start' mt={2} ml={-4} direction='column'>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button variant="ghost" size="sm">{selected}</Button>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            {Object.keys(fieldMap).map((label) => (
                              <Menu.Item key={label} value={label} onClick={() => handleSelect(label)}>{label}</Menu.Item>
                            ))}
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                    <Input variant='flushed' w='120px' ml={4} css={{ "--focus-color": "teal" }} value={fieldMap[selected] ? form[fieldMap[selected]] || "" : ""} onChange={handleInputChange} />
                  </Flex>
                )
              })}
            </Flex>

         
            <Flex direction='column' mt={4}>
              <Text fontSize='sm'>自由記述</Text>
              <Input variant='flushed' w='270px' css={{ "--focus-color": "teal" }} mb={3} value={form.free_text ?? ""} onChange={e => handleChange("free_text", e.target.value)} />
            </Flex>
          </Card.Body>
        </Card.Root>
      </Flex>

   
      <Flex justify='center' align='center' direction='row' gap={6}>
        <Flex align='center' direction='column'>
          <IconButton variant='ghost' size='2xl' mb={-4} onClick={handleUpdateCard}><FaRegPenToSquare color='teal' /></IconButton>
          <Text fontSize='12px' fontWeight='bold' color='teal'>保存</Text>
        </Flex>

        {shareAlert ? (
          <Flex align='center' direction='column'>
            <IconButton variant='ghost' size='2xl' mb={-4} onClick={() => setShareAlert(!shareAlert)}><FaRegCircleCheck color='teal' /></IconButton>
            <Text fontSize='12px' fontWeight='bold' color='teal'>コピー完了</Text>
          </Flex>
        ) : (
          <Flex align='center' direction='column'>
            <Clipboard.Root value={`http://localhost:3000/share/${cardId}`} onClick={() => setShareAlert(!shareAlert)}>
              <Clipboard.Trigger asChild>
                <IconButton variant='ghost' size='2xl' mb={-4}>
                  <FaLink color='teal' />
                </IconButton>
              </Clipboard.Trigger>
            </Clipboard.Root>
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
                router.push("/");
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
