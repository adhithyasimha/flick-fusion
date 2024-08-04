import type { NextApiRequest, NextApiResponse } from 'next';

// This variable will store the latest content data
let latestContentData = {
  id: '',
  media_type: ''
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Return the latest content data
      res.status(200).json(latestContentData);
      break;

    case 'POST':
      // Log the entire body of the request to debug the issue
      console.log('Received POST request body:', req.body);
      
      // Process the POST request
      const { id, media_type } = req.body;
      
      // Update the latest content data
      latestContentData = { id, media_type };
      
      console.log(`Received content data: id=${id}, media_type=${media_type}`);

      // Send a response
      res.status(200).json({ message: 'Content data received and stored successfully' });
      break;

    case 'PUT':
      // Process the PUT request (similar to POST for this example)
      const putData = req.body;
      latestContentData = putData;
      
      console.log(`Updated content data: id=${putData.id}, media_type=${putData.media_type}`);

      res.status(200).json({ message: 'Content data updated successfully' });
      break;

    default:
      // Handle any other HTTP method
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
