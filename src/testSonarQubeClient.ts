import { SonarQubeClient } from './sonarqube.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function testSonarqube() {
  try {
    // 获取环境变量
    const token = process.env.SONARQUBE_TOKEN || '';
    const baseUrl = process.env.SONARQUBE_URL || '';

    // 要测试的项目键
    const projectKey = 'code-fccb';

    if (!token) {
      console.error('错误: 未设置 SONARQUBE_TOKEN 环境变量');
      return;
    }

    console.log(`测试连接 SonarQube 服务器: ${baseUrl}`);

    // 初始化客户端
    const client = new SonarQubeClient(token, baseUrl);

    // 测试项目问题查询
    console.log(`\n测试项目问题查询，使用项目键: ${projectKey}`);

    // 简单查询项目问题
    const issuesResult = await client.getIssues({
      projectKey: projectKey,
      page: 1,
      pageSize: 10,
      inNewCodePeriod: false,
      branch: 'origin/release-3.x',
      types: ['BUG'],
    });

    console.log(`该项目有 ${issuesResult.paging.total} 个问题`);

    if (issuesResult.issues.length > 0) {
      console.log('\n问题示例:');
      issuesResult.issues.slice(0, 3).forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity || '未知'}] ${issue.message}`);
      });

      // 打印前两个问题的完整报文体
      console.log('\n前两个问题的完整报文体:');
      console.log(JSON.stringify(issuesResult.issues.slice(0, 2), null, 2));
    } else {
      console.log('该项目没有问题');
    }

    console.log('\n测试完成!');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

testSonarqube();
