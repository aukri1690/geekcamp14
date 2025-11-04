import { Button, Card, Field, Flex, Input, InputGroup, Stack } from "@chakra-ui/react"
import { MdOutlineMailOutline } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";

const Auth = () => {
  return (
    <>
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
                <Input size='lg' variant='subtle' css={{ "--focus-color": "teal" }} />
                </InputGroup>
              </Field.Root>
              <Field.Root>
                <Field.Label>パスワード</Field.Label>
                <InputGroup startElement={<IoKeyOutline />}>
                  <Input size='lg' variant='subtle' css={{ "--focus-color": "teal" }} />
                </InputGroup>
              </Field.Root>
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="center">
            <Button variant="solid" colorPalette='teal'>登録</Button>
          </Card.Footer>
        </Card.Root>
      </Flex>
    </>
  );
};

export default Auth;