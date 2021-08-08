import React, { useEffect, useRef } from 'react';

import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

import Header from '~/components/Header';

import { Container, Content, ChartContainer, Title } from './styles';
import { useAuth } from '~/hooks/auth';

const Analytics: React.FC = () => {
  const dailyPointsChartRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const dailyPostsChartRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const cloudChartRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const postsReceivedPerDepartmentRef = useRef<HTMLDivElement>(
    {} as HTMLDivElement,
  );
  const postsSentPerDepartmentRef = useRef<HTMLDivElement>(
    {} as HTMLDivElement,
  );

  const { token } = useAuth();

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-project-0-sqroh',
      getUserToken: () => token,
    });
    const dailyPointsChart = sdk.createChart({
      chartId: 'f7aa6eeb-fb17-4468-ab91-7163e235c5b8',
      width: 1020,
      height: 400,
    });
    dailyPointsChart.render(dailyPointsChartRef.current);

    const dailyPostsChart = sdk.createChart({
      chartId: 'e4f176a0-f377-4bea-a49b-33151454a6e7',
      width: 400,
      height: 400,
    });
    dailyPostsChart.render(dailyPostsChartRef.current);

    const cloudPostsChart = sdk.createChart({
      chartId: '5bb11eeb-eb7a-4eff-a117-745e44994515',
      width: 600,
      height: 400,
    });
    cloudPostsChart.render(cloudChartRef.current);

    const postsReceivedPerDepartment = sdk.createChart({
      chartId: 'ee431e97-ce53-44e3-ba2f-48bb5743b96a',
      width: 500,
      height: 400,
    });
    postsReceivedPerDepartment.render(postsReceivedPerDepartmentRef.current);

    const postsSentPerDepartment = sdk.createChart({
      chartId: '1c36f9b3-98f0-48c2-b75f-83f06d913b25',
      width: 500,
      height: 400,
    });
    postsSentPerDepartment.render(postsSentPerDepartmentRef.current);
  }, [token]);

  return (
    <>
      <Header />
      <Title>Acompanhe as métricas de sua empresa</Title>

      <Container>
        <Content>
          <ChartContainer ref={cloudChartRef} />
          <ChartContainer ref={dailyPostsChartRef} />
          <ChartContainer ref={dailyPointsChartRef} />
          <ChartContainer ref={postsReceivedPerDepartmentRef} />
          <ChartContainer ref={postsSentPerDepartmentRef} />
        </Content>
      </Container>
    </>
  );
};

export default Analytics;
