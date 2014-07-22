

describe("Event", function () {
  describe("Anonymous Calls", function () {
    it("GET /events/upcoming should return 401");
    it("GET /events should return 401");
    it("POST /events should return 401");
  });
  describe("User Auth calls", function () {
    it("GET /events/upcoming should return the upcoming event list");
    it("GET /events should return 403");
    it("POST /events should return 403");
  });
  describe("Admin Auth Calls", function () {
    it("GET /events/upcoming should return the upcoming event list");
    it("GET /events should return a list of all the events");
    it("POST /events should return should create a new event");
  });
});
