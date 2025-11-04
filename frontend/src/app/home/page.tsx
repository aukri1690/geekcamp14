import HomeFull from '@/components/HomeFull';
import HomeEmpty from '@/components/HomeEmpty';
import TabBar from '@/components/TabBar';

const Home = () => {
  return(
    <>
      {/* 自己紹介カードの有無で条件分岐する */}
      {/* <HomeFull /> */}
      <HomeEmpty />
      <TabBar />
    </>
  );
};

export default Home;
