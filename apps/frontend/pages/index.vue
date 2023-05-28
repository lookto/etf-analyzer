<template>
  <div class="main-container">
    <div class="heading">
      <h1 class="heading__title">
        Welcome to your new <span class="gradient__text">sidebase</span> app!
      </h1>
      <p class="heading__credits">
        Read our documentation <a href="https://sidebase.io/sidebase/welcome" target="_blank">here</a>.
        Get started in no time with the following amazing modules:
      </p>
    </div>
    <div class="cards">
      <div class="card auth__card">
        <div class="card__body">
          <h2 class="card__title">
            Authentication
          </h2>
          <p>
            Nuxt user authentication and sessions through nuxt-auth. nuxt-auth wraps NextAuth.js to offer the reliability & convenience of a 12k star library to the nuxt 3 ecosystem with a native developer experience (DX)
          </p>
        </div>
        <p class="card__action">
          <a class="card__link" href="https://sidebase.io/nuxt-auth/getting-started" target="_blank">
            Read documentation
          </a>
          <a class="card__link" href="/protected" target="_blank">
            See example
          </a>
        </p>
      </div>
      <div class="card trpc__card">
        <div class="card__body">
          <h2 class="card__title">
            tRPC
          </h2>
          <p>
            tRPC allows you to easily build & consume fully typesafe APIs without schemas or code generation.
          </p>
        </div>
        <p class="card__action">
          <a class="card__link" href="https://sidebase.io/sidebase/components/trpc" target="_blank">
            Read documentation
          </a>
          <a class="card__link" href="/trpc" target="_blank">
            See example
          </a>
        </p>
      </div>
      <div class="card tailwind__card">
        <div class="card__body">
          <h2 class="card__title">
            TailwindCSS
          </h2>
          <p>
            Rapidly build modern websites without ever leaving your HTML.
          </p>
        </div>
        <p class="card__action">
          <a class="card__link" href="https://sidebase.io/sidebase/components/tailwindcss" target="_blank">
            Read documentation
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-color: #eefbfc;
    color: #484848;
  }

  .main-container {
    max-width: 45vw;
    margin: auto;
    padding-top: 60px;
  }

  /* HEADING */

  .heading {
    text-align: center;
  }

  .heading__title {
    font-weight: 600;
    font-size: 40px;
  }

  .gradient__text {
    background: linear-gradient(to right, #7bceb6 10%, #12a87b 40%, #0FCF97 60%, #7bceb6 90%);
    background-size: 200% auto;
    color: #000;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 1s linear infinite;
  }

  @keyframes shine {
    to {
        background-position: 200% center;
    }
  }

  .heading__credits {
    color: #888888;
    font-size: 25px;
    transition: all 0.5s;
  }

  .heading__credits a {
    text-decoration: underline;
  }

  /* CARDS */
  .cards {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 30px;
  }

  .card {
    padding: 20px;
    width: 100%;
    min-height: 200px;
    display: grid;
    grid-template-rows: 20px 50px 1fr 50px;
    border-radius: 10px;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.25);
    transition: all 0.2s;
    cursor: default;
  }

  .card:hover {
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.4);
    transform: scale(1.01);
  }

  .card__link {
    position: relative;
    text-decoration: underline;
    color: rgba(255, 255, 255, 0.9);
  }

  .card__title {
    font-weight: 400;
    color: #ffffff;
    font-size: 30px;
  }

  .card__body {
    grid-row: 2/4;
  }

  .card__body p {
    color: #ffffff;
  }

  .card__action {
    grid-row: 5/6;
    align-self: center;
    display: flex;
    gap: 20px
  }

  /* RESPONSIVE */

  @media (max-width: 1600px) {
    .main-container {
        max-width: 100vw;
        padding: 50px;
    }

    .cards {
        justify-content: center;
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }

    .auth__card { background: radial-gradient(#0FCF97, #0B9A71); }
    .trpc__card { background: radial-gradient(#a07ccf, #926dc2); }
    .tailwind__card { background: radial-gradient(#7466e3, #5a4ad9); }
</style>
