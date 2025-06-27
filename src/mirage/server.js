// src/mirage/server.js
import { createServer, Model, Factory, RestSerializer } from 'miragejs';

export function makeServer() {
  return createServer({
    serializers: {
      application: RestSerializer,
    },

    models: {
      task: Model,
      user: Model,
    },

    seeds(server) {
      server.create('user', { id: 1, name: 'Alice Dupont', role: 'Developer' });
      server.create('user', { id: 2, name: 'Jean Martin', role: 'Project Manager' });
      server.create('user', { id: 3, name: 'Sophie Bernard', role: 'Designer' });

      server.create('task', {
        id: 1,
        title: 'Setup project',
        description: 'Initialize React app',
        status: 'todo',
        priority: 'high',
        userId: 1,
      });
      server.create('task', {
        id: 2,
        title: 'Design UI',
        description: 'Create wireframes',
        status: 'in-progress',
        priority: 'medium',
        userId: 3,
      });
    },

    routes() {
      this.namespace = 'api';

      this.get('/tasks', (schema) => {
        return schema.tasks.all();
      });

      this.post('/tasks', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.tasks.create(attrs);
      });

      this.put('/tasks/:id', (schema, request) => {
        let newAttrs = JSON.parse(request.requestBody);
        let id = request.params.id;
        let task = schema.tasks.find(id);
        return task.update(newAttrs);
      });

      this.delete('/tasks/:id', (schema, request) => {
        let id = request.params.id;
        return schema.tasks.find(id).destroy();
      });

      this.get('/users', (schema) => {
        return schema.users.all();
      });
    },
  });
}
