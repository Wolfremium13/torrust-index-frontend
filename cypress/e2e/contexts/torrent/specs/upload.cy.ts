import { RegistrationForm, random_user_registration_data } from "../../user/registration";

describe("A registered user", () => {
  let registration_form: RegistrationForm;

  before(() => {
    registration_form = random_user_registration_data();

    cy.visit("/");
    cy.visit("/signup");
    cy.register(registration_form);
    cy.login(registration_form.username, registration_form.password);
  });

  it("should be able to upload a torrent", () => {
    // todo: generate a random torrent file to isolate the test from previous executions.

    cy.visit("/upload");

    cy.get("input[data-cy=\"upload-form-title\"]").type("title-mandelbrot_set_01.torrent");
    cy.get("textarea[data-cy=\"upload-form-description\"]").type("description");
    cy.get("select[data-cy=\"upload-form-category\"]").select("software");

    // todo: add tag.
    // By default there are no tags, so we need to create them first with
    // a custom command. We can enable this feature after writing the test for
    // the tags context.  We could even create some tags before running all the
    // tests.
    // cy.get("input[data-cy=\"upload-form-tags\"]").select('fractals');

    cy.get("input[data-cy=\"upload-form-torrent-upload\"]").selectFile(
      {
        contents: "cypress/fixtures/torrents/mandelbrot_set_01.torrent",
        fileName: "mandelbrot_set_01.torrent",
        mimeType: "application/x-bittorrent"
      }, { force: true });

    cy.get("button[data-cy=\"upload-form-submit\"]").click();

    cy.url().should("include", "/torrent/0c90fbf036e28370c1ec773401bc7620146b1d48");
  });
});
