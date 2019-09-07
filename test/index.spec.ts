import * as chai from "chai";

import { APIMock } from "../src";
import { IAPIMockResponse } from "../src";

describe("MockAPI Unit Tests", () => {
  it("generates a default response when no routes are setup", async () => {
    const mock: APIMock = new APIMock({});

    const response: IAPIMockResponse = await mock.generateResponse("route:user_get");

    chai.expect(response.statusCode).to.be.equal(200); // Default
    chai.expect(response.body).to.be.equal("Ok");
  });

  it("generates a default response when given a non-configured label", async () => {
    const mock: APIMock = new APIMock({
      routes: {
        "route:index": {
          statusCode: 200,
        },
      },
    });

    const response: IAPIMockResponse = await mock.generateResponse("route:user_get");

    chai.expect(response.statusCode).to.be.equal(200); // Default
    chai.expect(response.body).to.be.equal("Ok");
  });

  it("can return static data (string body)", async () => {
    const mock: APIMock = new APIMock({
      routes: {
        "route:index": {
          body: "We ain't found shit",
          headers: {
            "x-header-one": 1,
            "x-session-id": "AD5BD4",
          },
          statusCode: 404,
        },
      },
    });

    const response: IAPIMockResponse = await mock.generateResponse("route:index");

    chai.expect(response.statusCode).to.be.equal(404);
    chai.expect(response.body).to.be.equal("We ain't found shit");
    chai.expect(response.headers).to.deep.equal({
      "x-header-one": 1,
      "x-session-id": "AD5BD4",
    });
  });

  it("can return static data (object body)", async () => {
    const mock: APIMock = new APIMock({
      routes: {
        "route:index": {
          body: {
            firstName: "Jaime",
            lastName: "Maldanado",
          },
          headers: {
            "x-header-one": 1,
            "x-session-id": "AD5BD4",
          },
          statusCode: 404,
        },
      },
    });

    const response: IAPIMockResponse = await mock.generateResponse("route:index");

    chai.expect(response.statusCode).to.be.equal(404);
    chai.expect(response.body).to.be.deep.equal({
      firstName: "Jaime",
      lastName: "Maldanado",
    });
    chai.expect(response.headers).to.deep.equal({
      "x-header-one": 1,
      "x-session-id": "AD5BD4",
    });
  });

  it("can simlate latency", async () => {
      const mock: APIMock = new APIMock({
        "latency": {
          max: 2000,
          min: 1000,
        },
        "routes": {
            "get-users": {
              statusCode: 200,
            },
        },
      });

      const start: number = (new Date()).getTime();
      await mock.generateResponse("get-users");
      const end: number = (new Date()).getTime();

      const latency: number = end - start;

      chai.expect(latency).to.be.lessThan(2000);
      chai.expect(latency).to.be.greaterThan(1000);

  });
});
