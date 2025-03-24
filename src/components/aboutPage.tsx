import React from "react";
import AltHeader from "./altHeader";
import Footer from "./footer";

function AboutPage() {
  return (
    <div style={styles.page}>
      <AltHeader />
      <div style={styles.container}>
        <img
          src="http://localhost:3000/assets/chad-and-svetlana-photo.jpg"
          alt="Chad and Svetlana Zimmerman"
          style={styles.cover}
        />
        <div style={styles.rightColumn}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>Chad and Svetlana Zimmerman</h1>
            <h3 style={styles.sectionTitle}>Our Journey</h3>
            <p style={styles.text}>
              Beresta Literary Press was born in the quiet hush of the 2020
              lockdowns, a spark of magic in a time of uncertainty. What began
              as a simple desire—to share the beauty of language and
              culture—quickly transformed into something far greater. We
              uncovered forgotten fairytales, whispered from the past, and gave
              them new voices in English, Russian, and Japanese. Over the years,
              our little press has grown like an enchanted forest, branching
              into poetry, theology, philosophy, coloring books, children’s
              stories, and even language-learning guides. In 2024, our stories
              carried us to unexpected heights, making us best-selling authors.
              Yet, at its heart, Beresta remains what it has always been: a
              gateway to worlds unseen, where ancient words find new life, and
              every book is a spell cast in ink.
            </p>
            {/* Chad Section */}
            <h3 style={styles.sectionTitle}>About Chad</h3>
            <p style={styles.text}>
              For nine years, I wandered the streets of Japan, not just learning
              the language but becoming a storyteller of its life and culture,
              sharing its wonders with millions on YouTube. Then, the world
              paused. In that stillness, I met my wife, who opened a door to a
              world even more magical than I had imagined—Russian fairytales.
              Their strange beauty and haunting wonder captivated me, and
              together, we embarked on our first translation: Marvelous Miracles
              and Somber Stories. That journey has since led me to another
              passion: historical theology and philosophy, which I now weave
              into our ever-growing collection at Beresta Literary Press. With a
              Master of Divinity from the American Lutheran Theological
              Seminary, I continue to chase the stories that shape
              civilizations, giving voice to the echoes of the past and bringing
              forgotten wisdom into the present.
            </p>
            {/* Svetlana Section */}
            <h3 style={styles.sectionTitle}>About Svetlana</h3>
            <p style={styles.text}>
              Condimentum Lorem ipsum odor amet, consectetuer adipiscing elit.
              Dolor maecenas ipsum suscipit placerat diam eros commodo. Ex orci
              placerat ex porttitor enim ligula amet libero. Et iaculis ut ipsum
              turpis natoque pretium. Ante ante convallis amet per rutrum.
              Condimentum scelerisque volutpat urna molestie erat sociosqu
              tempus inceptos at.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  container: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    padding: "0 20px 20px 20px",
    maxWidth: "1000px",
    margin: "0 auto",
    flex: 1,
  },
  cover: {
    maxWidth: "300px",
    height: "auto",
    marginTop: 0,
  },
  rightColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    fontFamily: "'inknut antiqua', sans-serif",
    marginTop: 0,
  },
  titleSection: {
    margin: 0,
    paddingTop: 0,
  },
  title: {
    fontSize: "28px",
    margin: "0 0 10px 0",
    lineHeight: 1,
  },
  text: {
    fontSize: "16px",
    margin: "5px 0",
    color: "#000000", // Black for body text
  },
  sectionTitle: {
    fontSize: "20px",
    margin: "20px 0 10px 0", // More space above sections
  },
};

export default AboutPage;
