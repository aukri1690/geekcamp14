'use client'

import { Button, Card, FileUpload, Flex, Image, Input, Menu, Portal, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

const CreateSelfIntroductionCard = () => {
  const [preview, setPreview] = useState<string | null>(null)
  const [selected1, setSelected1] = useState<string>('項目1▽')
  const [selected2, setSelected2] = useState<string>('項目2▽')

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <>
      <Flex justify='center' align='center' minH='100vh' direction='column' gap={20}>
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
                    src={preview ?? "https://i.pravatar.cc/300?img=4"}
                    alt="Profile image"
                    cursor="pointer"
                    transition="transform 0.15s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                </FileUpload.Trigger>
              </FileUpload.Root>
            </Flex>

            <Flex direction='row' gap={8}>
              <Flex direction='column'>
                <Text fontSize='sm'>名前</Text>
                <Input variant='flushed' w='120px' css={{ "--focus-color": "teal" }} mb={3}></Input>
              </Flex>
              <Flex direction='column'>
                <Text fontSize='sm'>ふりがな</Text>
                <Input variant='flushed' w='120px' css={{ "--focus-color": "teal" }}></Input>
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
                        <Menu.Item value="goal" onClick={() => setSelected1('目標')}>目標</Menu.Item>
                        <Menu.Item value="hobby" onClick={() => setSelected1('趣味')}>趣味</Menu.Item>
                        <Menu.Item value="interest" onClick={() => setSelected1('興味')}>興味</Menu.Item>
                        <Menu.Item value="qualifications" onClick={() => setSelected1('保有資格')}>保有資格</Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <Input variant='flushed' w='120px' ml={4} css={{ "--focus-color": "teal" }}></Input>
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
                        <Menu.Item value="goal" onClick={() => setSelected2('目標')}>目標</Menu.Item>
                        <Menu.Item value="hobby" onClick={() => setSelected2('趣味')}>趣味</Menu.Item>
                        <Menu.Item value="interest" onClick={() => setSelected2('興味')}>興味</Menu.Item>
                        <Menu.Item value="qualifications" onClick={() => setSelected2('保有資格')}>保有資格</Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <Input variant='flushed' w='120px' ml={4} css={{ "--focus-color": "teal" }}></Input>
              </Flex>

            </Flex>
            <Flex direction='column' mt={4}>
              <Text fontSize='sm'>自由記述</Text>
              <Input variant='flushed' w='270px' css={{ "--focus-color": "teal" }} mb={3}></Input>
            </Flex>

          </Card.Body>
        </Card.Root>

        <Button variant="solid" colorPalette='teal' fontWeight='bold' size='lg'>作成</Button>
      </Flex>
    </>
  );
};

export default CreateSelfIntroductionCard;