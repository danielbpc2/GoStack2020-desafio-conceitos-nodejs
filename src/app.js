const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Retorna todos os repositorios
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * Cria um repositório
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

/**
 * Edita um repositório
 */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository not found" });

  const editedRepository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = editedRepository;

  return response.status(200).json(editedRepository);
});

/**
 * Deleta um repositorio
 */
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository not found" });

  repositories.splice(repositoryIndex, 1);

  return response.send(204);
});

/**
 * Da um Like em um repositório
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository not found" });

  const newLike = repositories[repositoryIndex].likes + 1;

  const editedRepository = {
    ...repositories[repositoryIndex],
    likes: newLike,
  };

  repositories[repositoryIndex] = editedRepository;

  return response.status(200).json(editedRepository);
});

module.exports = app;
