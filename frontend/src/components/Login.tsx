'use client';

import { Button, Card, Field, Flex, Input, InputGroup, Stack, Link } from "@chakra-ui/react"
import { MdOutlineMailOutline } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  return (
    <>
      <Flex justify='center' align='center' minH='100vh'>
        <Card.Root maxW="sm" variant='elevated'>
          <Card.Header justifyContent='center'>
            <Card.Title>ログイン</Card.Title>
          </Card.Header>
          <Card.Body>
            <Stack gap="4" w="full">
              <Field.Root>
                <Field.Label>メールアドレス</Field.Label>
                <InputGroup startElement={<MdOutlineMailOutline />}>
                <Input size='lg' variant='subtle' css={{ "--focus-color": "teal" }} placeholder='メールアドレスを入力' />
                </InputGroup>
              </Field.Root>
              <Field.Root>
                <Field.Label>パスワード</Field.Label>
                <InputGroup startElement={<IoKeyOutline />}>
                  <Input size='lg' variant='subtle' css={{ "--focus-color": "teal" }} placeholder='パスワードを入力' />
                </InputGroup>
              </Field.Root>
            </Stack>
          </Card.Body>
          <Card.Title fontSize='sm' fontWeight='normal' textAlign='center' mb={4}>
            新規ユーザー登録は
            <Link color='teal.500' ml={1} cursor='pointer' onClick={() => router.push('/auth')}>
              こちら
            </Link>
          </Card.Title>
          <Card.Footer justifyContent="center">
            <Button variant="solid" colorPalette='teal'>ログイン</Button>
          </Card.Footer>
        </Card.Root>
      </Flex>
    </>
  );
};

export default Login;