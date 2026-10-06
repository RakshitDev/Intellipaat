const MOCK_USERS = [
  { id: 1, name: 'Rahul', email: 'rahul@test.com', password: 'password@123' },
  { id: 2, name: 'Rohan', email: 'rohan@test.com', password: 'password@456' },
];

export async function login(email, password) {
  await new Promise(r => setTimeout(r, 1000)); //fake network delay

  const user = MOCK_USERS.find(
    u =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password,
  );
  if (!user) throw new Error('Incorrect Email or Password');
  const { password: _, ...safeUser } = user;
  return { token: `mock-token-${user.id}`, user: safeUser };
}
