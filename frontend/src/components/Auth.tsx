'use client';

import { useState } from "react";
import { Button, Card, Field, Flex, Input, InputGroup, Stack, Text } from "@chakra-ui/react"
import { MdOutlineMailOutline } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || '登録に失敗しました');
      } else {
        setMessage(data.message || '登録完了。確認メールを確認してください。');
        // 必要であればログインページに遷移
        // router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || '通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex justify='center' align='center' minH='100vh'>
      <Card.Root maxW="sm" variant='elevated'>
        <Card.Header justifyContent='center'>
          <Card.Title>新規ユーザー登録</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field.Root>
              <Field.Label>メールアドレス</Field.Label>
              <InputGroup startElement={<MdOutlineMailOutline />}>
                <Input
                  size='lg'
                  variant='subtle'
                  css={{ "--focus-color": "teal" }}
                  placeholder='メールアドレスを入力'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Field.Root>
            <Field.Root>
              <Field.Label>パスワード</Field.Label>
              <InputGroup startElement={<IoKeyOutline />}>
                <Input
                  size='lg'
                  variant='subtle'
                  css={{ "--focus-color": "teal" }}
                  placeholder='パスワードを入力'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </Field.Root>
            {error && <Text color='red.500'>{error}</Text>}
            {message && <Text color='green.500'>{message}</Text>}
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="center">
          <Button variant="solid" colorPalette='teal' onClick={handleSignup} >
            登録
          </Button>
        </Card.Footer>
      </Card.Root>
    </Flex>
  );
};

export default Auth;


