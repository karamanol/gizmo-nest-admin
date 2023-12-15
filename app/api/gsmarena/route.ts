import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest } from "next/server";
//@ts-ignore
import { search, catalog } from "gsmarena-api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const productName = url.searchParams.get("name");
  if (!productName)
    return Response.json({ status: 404, data: "Name not set as param" });
  try {
    const devices = await search.search(productName);
    if (Array.isArray(devices) && devices.length > 0) {
      console.log("devices", devices[0]);
      const specs = await catalog.getDevice(devices[0].id);
      console.log("specs", specs);
      if (specs) {
        return Response.json({
          status: 200,
          data: {
            description: devices[0].description,
            quickSpec: specs.quickSpec,
            imgLink: specs.img,
          },
        });
      }
    }

    return Response.json({ status: 404, data: "No info for this product" });
  } catch (err) {
    if (err) {
      return Response.json({ error: getErrorMessage(err), status: 500 });
    }
  }
}
