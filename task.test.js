import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Task API", () => {
  let createdTaskId;

  it("should create a new task", async () => {
    const res = await request(app).post("/tasks").send({ text: "Test task" });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe("Test task");
    createdTaskId = res.body._id;
  });

  it("should get all tasks", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update task status", async () => {
    const res = await request(app)
      .patch(`/tasks/${createdTaskId}`)
      .send({ status: "done" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("done");
  });

  it("should delete the task", async () => {
    const res = await request(app).delete(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(204);
  });
});
