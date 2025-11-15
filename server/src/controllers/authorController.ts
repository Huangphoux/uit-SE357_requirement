import { Request, Response } from "express";
// import { prisma } from '../lib/prisma.js';

export async function getAuthorById(req: Request, res: Response): Promise<void> {
  const { authorId: _authorId } = req.params;

  // TODO: Add Author model to schema.prisma
  // const author = await prisma.author.findUnique({
  //   where: { id: +authorId },
  // });

  // if (!author) {
  //   res.status(404).send('Author not found');
  //   return;
  // }

  // res.send(`Author Name: ${author.name}`);

  res.status(501).send("Author functionality not yet implemented");
}
