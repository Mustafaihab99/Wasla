import * as signalR from "@microsoft/signalr";

export const createHubConnection = (hubUrl: string, token: string) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  return connection;
};
