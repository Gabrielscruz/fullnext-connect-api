import "@fastify/jwt"

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string,
      id: number
      name: string,
      email: string,
      profileUrl: string,
      accessControlId: number,
      subscriptionActive: boolean,
      theme:  'fullnest-dark' | 'fullnest-light'
      } 
  }
  
}