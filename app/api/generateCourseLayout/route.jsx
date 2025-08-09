import { db } from "@/config/db";
import { courseTabel } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import axios from 'axios';



const PROMPT=`Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description,Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only
Schema:
{
  "course": {
    "title": "string",
    "description": "string",
    "category": "string",
    "difficulty": "string",
    "includeVideo": "boolean",
    "chapters": "number",
"bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ],
     
      }
    ]
  }
}
, User Input: 
`


export async function POST(req) {
  const {courseId,...formData} = await req.json();
  const user = await currentUser();
  
  async function main() {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
      
      const tools = [
        {
          googleSearch: {},
        },
      ];
      
      const config = {
        thinkingConfig: {
          thinkingBudget: -1,
        },
        tools,
      };
      
      const model = "gemini-2.5-pro";
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: PROMPT + JSON.stringify(formData),
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });
      
      // Get the response text
      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('Generated content:', responseText);

      // Try to parse the response as JSON
      let parsedResponse;
      try {
        // Extract JSON from the response if it's wrapped in markdown code blocks or similar
        const jsonMatch = responseText.match(/{[\s\S]*}/);
        parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Failed to parse the AI response. The response was not valid JSON.');
      }

      const imagePrompt = parsedResponse.course?.bannerImagePrompt;
        //  generate image
        const imageResult = await generateImage(imagePrompt);
        console.log(imageResult);






      // Save to database (uncomment and modify as needed)
      const result = await db.insert(courseTabel).values({
        ...formData,
        courseJson: JSON.stringify(parsedResponse),
        cid: courseId,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        bannerImage: imageResult,
      });
      

      return NextResponse.json({courseId: courseId});
      
    } catch (error) {
      console.error('Error in generateCourseLayout:', error);
      return NextResponse.json(
        { 
          error: 'Failed to generate course content',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }
  }

  return main();
}



const generateImage = async (imagePrompt)=>{
  const BASE_URL='https://aigurulab.tech';
  const result = await axios.post(BASE_URL+'/api/generate-image',
          {
              width: 1024,
              height: 1024,
              input: imagePrompt,
              model: 'flux',//'flux'
              aspectRatio:"16:9"//Applicable to Flux model only
          },
          {
              headers: {
                  'x-api-key': process?.env?.AIGURULAB_API_KEY, // Your API Key
                  'Content-Type': 'application/json', // Content Type
              },
          })
  console.log(result.data.image) //Output Result: Base 64 Image
  return result.data.image
}