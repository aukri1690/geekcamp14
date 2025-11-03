import { Button, EmptyState, Flex, VStack } from "@chakra-ui/react"
import { RiErrorWarningLine } from "react-icons/ri";

const HomeEmpty = () => {
  return (
    <Flex justify="center" align="center" height="100vh">
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <RiErrorWarningLine color='red' />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>自己紹介カードが作成されていません</EmptyState.Title>
          <EmptyState.Description>今すぐ作成しますか？</EmptyState.Description>
        </VStack>
        <Button variant='solid' colorPalette='purple' rounded='lg' fontWeight='bold'>作成する</Button>
      </EmptyState.Content>
    </EmptyState.Root>
    </Flex>
  );
};

export default HomeEmpty;