import auth from '@/client/api/auth'

const client = new auth('http://peer.lan:3002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzYxMDAwNjYsInN1YiI6IjEifQ.o_KjmvV8oCk8kByS4jpKnk6EGZR4lBFqh3jT3AtwDN0')

export default client
