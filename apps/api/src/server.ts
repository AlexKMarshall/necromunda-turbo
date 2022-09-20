import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import morgan from 'koa-morgan'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createServer = () => {
  const app = new Koa()
  const router = new Router()

  router.get('/', (ctx) => {
    ctx.body = 'Hello world'
  })
  router.get('/factions', async (ctx) => {
    const factions = await prisma.faction.findMany()
    const totalCount = await prisma.faction.count()
    ctx.body = { items: factions, meta: { pagination: { totalCount } } }
  })
  router.post('/factions', async (ctx) => {
    const savedFaction = await prisma.faction.create({
      data: ctx.request.body as any,
    })
    ctx.body = savedFaction
  })
  router.get('/healthz', (ctx) => (ctx.body = { ok: true }))

  app
    .use(morgan('dev'))
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())

  return app
}
