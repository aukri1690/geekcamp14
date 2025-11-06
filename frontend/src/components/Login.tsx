'use client';

import { useState } from "react";
import { Button, Card, Field, Flex, Input, InputGroup, Stack, Link,Text } from "@chakra-ui/react"
import { MdOutlineMailOutline } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/login', { // Next.jsなら /api/login でバックエンドにプロキシ可能
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'ログインに失敗しました');
        setLoading(false);
        return;
      }

      // 成功時:user情報のみ保存して遷移
      localStorage.setItem('user', JSON.stringify(data.user));

       if (data.has_card) {
        router.push('/edit-card'); // すでにカードがある
      } else {
        router.push('/home'); // カード未作成
      }
    } catch (err: any) {
      setError(err.message || '通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

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
                <Input size='lg' variant='subtle' css={{ "--focus-color": "teal" }} placeholder='メールアドレスを入力' value={email}  onChange={(e) => setEmail(e.target.value)}/>
                </InputGroup>
              </Field.Root>
              <Field.Root>
                <Field.Label>パスワード</Field.Label>
                <InputGroup startElement={<IoKeyOutline />}>
                  <Input size='lg' variant='subtle' css={{ "--focus-color": "teal" }} placeholder='パスワードを入力' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </InputGroup>
              </Field.Root>
              {error && (
              <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
               )}
            </Stack>
          </Card.Body>
          <Card.Title fontSize='sm' fontWeight='normal' textAlign='center' mb={4}>
            新規ユーザー登録は
            <Link color='teal.500' ml={1} cursor='pointer' onClick={() => router.push('/auth')}>
              こちら
            </Link>
          </Card.Title>
          <Card.Footer justifyContent="center">
            <Button variant="solid" colorPalette='teal'onClick={handleLogin}>ログイン</Button>
          </Card.Footer>
        </Card.Root>
      </Flex>
    </>
  );
};

export default Login;