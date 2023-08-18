const users = [
  {
    username: 'admin',
    password: 'secret',
  },
  {
    username: 'user',
    password: 'pass',
  },
];

export const authenticate = (username: string, password: string): Promise<boolean> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(users.some((user) => user.username === username && user.password === password));
    }, 0);
  });
