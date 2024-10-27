import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

// Components
import { BackgroundImage1, BackgroundImage2, FooterCon, FooterLink, GenerateQuoteButton, GenerateQuoteButtonText, GradientBackgroundCon, QuoteGenerationSubTitle, QuoteGeneratorCon, QuoteGeneratorInnerCon, QuoteGeneratorTitle, RedSpan } from "@/components/QuoteGenerator/QuoteGeneratorElements";

// Assets
import Clouds1 from "../assets/Clouds1.png";
import Clouds2 from "../assets/Clouds2.png";
import { generateClient } from "aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { quotesQueryName } from "@/src/graphql/queries";

// Interface for our DynamoDB object
interface UpdateQuoteInfoData {
  id: string;
  queryName: string;
  quotesGenerated: number;
  createdAt: string;
  updatedAt: string;
}

// Typeguard for our fetch function
function isGraphQLResultForQuotesQueryName(response: any): response is GraphQLResult<{
  quotesQueryName: {
    items: UpdateQuoteInfoData[];
  };
}> {
  return response.data && response.data.quotesQueryName && response.data.quotesQueryName.items; 
}

const client = generateClient();

export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<number | null>(0);

  // Function to fetch our DynamoDB object (quotes generated)
  const updateQuoteInfo = async () => {
    try {
      const response = await client.graphql<UpdateQuoteInfoData>({
        query: quotesQueryName,
        authMode: "iam",
        variables: {
          queryName: "LIVE"
        },
      })
      console.log('response', response);
      // setNumberOfQuotes(response.data.quotesQueryName.items[0].quotesGenerated);

      // Create Type Guards
      if (!isGraphQLResultForQuotesQueryName(response)) {
        throw new Error("Unexpected response from API.graphql");
      }

      if (!response.data) {
        throw new Error("Response data is undefined");
      }

      const receivedNumberOfQuores = response.data.quotesQueryName.items[0].quotesGenerated;
      setNumberOfQuotes(receivedNumberOfQuores);
      
    } catch (error) {
      console.log('error getting quote data', error);
      
    }
  }

  useEffect(() => {
    updateQuoteInfo();
  }, [])

  return (
    <>
      <Head>
        <title>Quote Generator</title>
        <meta name="description" content="A project to generate quotes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*Background*/}
      <GradientBackgroundCon>

      {/*Quote Generator Modal Pop-Up*/}
      {/* <QuoteGeneratorModal
        // numberOfQuotes={numberOfQuotes}
        // setNumberOfQuotes={setNumberOfQuotes}
      /> */}

      {/*Quote Generator*/}
      <QuoteGeneratorCon>
        <QuoteGeneratorInnerCon>
          <QuoteGeneratorTitle>
            Daily Inspiration Generator
          </QuoteGeneratorTitle>

          <QuoteGenerationSubTitle>
            Looking for a splash of inspiration? Generate a quote card with a random inspirational quote
            provided by <FooterLink href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</FooterLink>.
          </QuoteGenerationSubTitle>

          <GenerateQuoteButton>
            <GenerateQuoteButtonText 
            // onClick={(null)}
            >
              Generate Quote
            </GenerateQuoteButtonText>
          </GenerateQuoteButton>
        </QuoteGeneratorInnerCon>
      </QuoteGeneratorCon>

      {/*Background Images*/}
      <BackgroundImage1
        src={Clouds1}
        height="300"
        alt="cloudybackground1"
      />

      <BackgroundImage2
        src={Clouds2}
        height="300"
        alt="cloudybackground2"
      />

      {/*Footer*/}
      <FooterCon>
        <>
          Quotes Generated: {numberOfQuotes}
          <br />
          Developed with ❤️ by <FooterLink href="https://github.com/blueberryhub92" target="_blank" rel="noopener noreferrer">blueberryhub92</FooterLink>
        </>
      </FooterCon>

      </GradientBackgroundCon>
    </>
  );
}
