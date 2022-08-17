<template>
  <main>
    <div class="flex flex-col">
      <section class="bg-home-about text-center py-10 space-y-3" id="about">
        <h2 class="text-4xl font-bold">About Port of Mars</h2>
        <p class="w-3/4 mx-auto">
          Port of Mars is an online, game-based, social science experiment set
          on the first human community on the Red Planet. Currently recruiting
          Arizona State University Undergraduates for game play.
        </p>
      </section>
      <section
        class="grid grid-cols-1 md:grid-cols-2 space-x-4 p-4 bg-home-game-trailer"
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
      <section class="bg-home-winners text-center space-y-3 py-10" id="winners">
        <h2 class="text-center text-4xl font-bold">Winners</h2>
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div>
            <h3 class="text-center text-3xl font-bold">Fall 2021</h3>
            <figure id="fall21">
              <img
                class="w-full mb-4"
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
            <h3 class="text-center text-3xl font-bold">Spring 2021</h3>
            <figure>
              <img
                class="w-full"
                src="assets/images/winner-spring21.png"
                alt="NASA astronaut Cady Coleman on Zoom with the Port of Mars winning team"
              />
              <figcaption>
                In a nail-biting finale, two players (Curator and Researcher)
                emerged as winners. The championship team were awarded a virtual
                dinner with NASA astronaut Cady Coleman
                <span
                  >(<a
                    href="https://www.instagram.com/astro_cady"
                    title="Instagram"
                    >Instagram
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-brand-instagram"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="#aa2a29"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <rect x="4" y="4" width="16" height="16" rx="4" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" /></svg
                  ></a>
                  <a href="https://twitter.com/Astro_Cady" title="Twitter"
                    >Twitter
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-brand-twitter"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="#aa2a29"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
                      /></svg></a
                  >).</span
                >
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section
        class="flex flex-col items-center justify-center space-y-5 py-10"
      >
        <h2 class="text-4xl font-bold">News</h2>
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
        <!--Insert Instagram widget, in the meantime, I've added them manually-->

        <a
          class="btn btn-wide"
          href="https://www.instagram.com/portofmars/"
          title="Go to Instagram"
          >See More</a
        >
      </section>
      <section class="bg-home-gameplay py-10" id="gameplay">
        <h2 class="text-4xl font-bold text-center">Gameplay</h2>
        <section class="grid grid-cols-1 md:grid-cols-2 space-x-4 p-4">
          <div class="flex flex-col justify-center space-y-5">
            <h3 class="text-center text-3xl font-bold">The Objective</h3>
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
