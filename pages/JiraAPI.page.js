class JiraAPIPage {
  constructor(page) {
    this.page = page;
    this.baseURL = 'https://api.jira.com/rest/api/2';
  }

  async createStory(token, payload) {
    const response = await this.page.request.post(`${this.baseURL}/issue`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      data: { fields: payload }
    });
    return {
      status: response.status(),
      data: await response.json()
    };
  }

  async verifyStoryCreated(storyKey) {
    const response = await this.page.request.get(`${this.baseURL}/issue/${storyKey}`);
    if (response.status() !== 200) {
      throw new Error(`Story ${storyKey} not found`);
    }
  }
}

module.exports = JiraAPIPage;