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
          <FaRegPenToSquare color='teal' onClick={() => router.push("/edit")} />
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
  );
};

export default TabBar;