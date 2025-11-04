import { Flex, Text } from "@chakra-ui/react"
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaRegPenToSquare } from "react-icons/fa6";


const TabBar = () => {
  return (
    <Flex justify='center' align='center' direction='row' gap={16}>
      <Flex align='center' direction='column'>
        <FaRegPenToSquare size='34px' color='gray' />
        {/*自己紹介カードが作成済みの場合は'編集'と表示*/}
        <Text fontSize='12px' fontWeight='bold' color='gray'>作成</Text>
      </Flex>
      <Flex align='center' direction='column'>
        <FaRegShareFromSquare size='35px' color='gray' />
        <Text fontSize='12px' fontWeight='bold' color='gray'>共有</Text>
      </Flex>
    </Flex>
  );
};

export default TabBar;