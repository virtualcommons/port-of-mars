<template>
  <main>
    <div class="flex flex-col">
      <section class="bg-home-about text-center" id="about">
        <h2>About Port of Mars</h2>
        <p class="w-3/4 mx-auto">
          Port of Mars is an online, game-based, social science experiment set
          on the first human community on the Red Planet. Currently recruiting
          Arizona State University Undergraduates for game play.
        </p>
      </section>
      <section
        class="grid grid-cols-1 md:grid-cols-2 space-x-4 bg-home-game-trailer"
      >
        <div class="flex flex-col justify-center space-y-5">
          <h3 class="text-center text-3xl font-bold">The Game</h3>
          <p class="w-3/4 mx-auto">
            You are 1 of 5 residents at the Port of Mars, the first long-term
            habitat on the planet. Each game consists of 8 —12 rounds, each with
            phases of investing, trading, purchasing, discarding, and reacting
            to Mars events. Chance and player actions impact system health. If
            system health falls to zero all players die.
          </p>
        </div>
        <div class="flex justify-center">
          <iframe
            title="vimeo-player"
            src="https://player.vimeo.com/video/644046830?h=0e08b0112c"
            width="640"
            height="360"
            allowfullscreen
          ></iframe>
        </div>
      </section>
      <section class="bg-home-winners" id="winners">
        <h2 class="text-center">Winners</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 class="text-center">Fall 2021</h3>
            <figure id="fall21">
              <img
                class="mb-4"
                src="assets/images/winner-fall21.jpg"
                alt="Winner Kyle Villa poses for a photo with the Port of Mars development team, all wearing Port of Mars black t-shorts and standing on a virtual Mars background"
              />
              <figcaption>
                Evan Covington and Kyle Villa tied for the first place in that
                game and both received 100 grams of Bondoc meteor fragments.
              </figcaption>
            </figure>
          </div>
          <div>
            <h3 class="text-center">Spring 2021</h3>
            <figure>
              <img
                class="mb-4"
                src="assets/images/winner-spring21.png"
                alt="NASA astronaut Cady Coleman on Zoom with the Port of Mars winning team"
              />
              <figcaption>
                In a nail-biting finale, two players (Curator and Researcher)
                emerged as winners. The championship team were awarded a virtual
                dinner with NASA astronaut Cady Coleman.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section
        class="flex flex-col items-center justify-center bg-home-news"
        id="news"
      >
        <h2>News</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-24">
          <img
            class="w-96"
            src="assets/images/news-Getting-There.png"
            alt="Port of Mars: Getting there is hard, getting along is harder."
          />
          <video class="w-96" controls>
            <source
              src="assets/images/news-Only-50_-Survive.mp4"
              type="video/mp4"
            />
            Sorry, your browser doesn't support embedded videos.
          </video>
          <video class="w-96" controls>
            <source
              src="assets/images/news-space-now-open.mp4"
              type="video/mp4"
            />
            Sorry, your browser doesn't support embedded videos.
          </video>
        </div>
        <a
          class="btn btn-wide btn-main"
          href="https://www.instagram.com/portofmars/"
          title="Go to Instagram"
          >See More</a
        >
      </section>
      <section class="bg-home-gameplay" id="gameplay">
        <h2 class="text-center">Gameplay</h2>
        <section class="grid grid-cols-1 md:grid-cols-2 space-x-4">
          <div class="flex flex-col justify-center space-y-5">
            <h3 class="text-center">The Objective</h3>
            <p class="w-3/4 mx-auto">
              Your mission is to stay alive and achieve the most victory points.
              Each round you receive 10 time blocks that you can invest in
              system health or accomplishments. System health will maintain the
              shared infrastructure (upkeep) and keep the team alive.
              Accomplishments will earn you victory points.
            </p>
          </div>
          <div class="flex justify-center">
            <iframe
              title="vimeo-player"
              src="https://player.vimeo.com/video/642036661?h=2295c303de"
              width="640"
              height="360"
              allowfullscreen
            ></iframe>
          </div>
        </section>
      </section>
    </div>
  </main>
</template>
