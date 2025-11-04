'use client';
import { Flex, IconButton, Text } from "@chakra-ui/react"
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaRegPenToSquare } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const TabBar = () => {
  const router = useRouter();
  return (
    <Flex justify='center' align='center' direction='row' gap={6}>
      <Flex align='center' direction='column'>
        <IconButton variant='ghost' size='2xl' mb={-4}>
          <FaRegPenToSquare color='gray' onClick={() => router.push("/create")} />
        </IconButton>
        {/*自己紹介カードが作成済みの場合は'編集'と表示*/}
        <Text fontSize='12px' fontWeight='bold' color='gray'>作成</Text>
      </Flex>
      <Flex align='center' direction='column'>
        <IconButton variant='ghost' size='2xl' mb={-4}>
          <FaRegShareFromSquare color='gray' onClick={() => router.push("/share")} />
        </IconButton>
        <Text fontSize='12px' fontWeight='bold' color='gray'>共有</Text>
      </Flex>
    </Flex>
  );
};

export default TabBar;