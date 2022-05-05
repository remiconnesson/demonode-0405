const request = require("supertest");
const db = require("../db");
const app = require("../app");
const mapToObj = (m) => {
  return Array.from(m).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
};

describe("Mon API CRUD", () => {

  beforeEach(()=>{
    // reset ta base avant chaque test
    db['memoryDb'] = new Map();
    db['id'] = 0;
    db['memoryDb'].set(db['id']++, { nom: "Alice" }) // voici comment set une nouvelle entrée.
    db['memoryDb'].set(db['id']++, { nom: "Bob" })
    db['memoryDb'].set(db['id']++, { nom: "Charlie" })
  })

  it("GET /api/names retourne JSON de la database", async () => {
    const res = await request(app)
      .get("/api/names")
      .expect(200)
      .expect("content-type", /json/);
    expect(JSON.parse(res.text)).toMatchObject(mapToObj(db.memoryDb));
  });

  it("POST /api/names doit créer un nouvel objet en BDD et le retourner", async () => {
    let insertion = { name: "Insertion" };
    let id = db.id;
    const res = await request(app)
      .post("/api/names")
      .send(insertion)
      .expect(201)
      .expect("content-type", /json/);

    expect(db.memoryDb.get(id)).toMatchObject(insertion);
  });



  it("PUT /api/name/:id modifie l'objet correspondant en DB", async () => {
    let modification = { name: "Modified" };
    const res = await request(app)
      .put("/api/name/1")
      .send(modification)
      .expect(204);
    expect(modification).toMatchObject(db.memoryDb.get(1));
  });

  test("GET /api/names retourne Alice, Bob et Charlie", async () => {
    // test
    const response = await request(app)
      .get("/api/names")
      .expect(200)
      .expect("Content-Type", /json/ );
    expect(response.body).toMatchObject({
      0: { nom: "Alice" },
      1: { nom: "Bob" },
      2: { nom: "Charlie" },
    });
  });

  it("GET /api/name/:id retourne le JSON de l'objet correspondant en DB", async () => {
    const res = await request(app)
      .get("/api/name/1")
      .expect(200)
      .expect("content-type", /json/);
    expect(JSON.parse(res.text)).toMatchObject(db.memoryDb.get(1));
  });
});
