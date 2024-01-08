import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest } from "next/server";
//@ts-ignore
import { search, catalog } from "gsmarena-api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const productName = url.searchParams.get("name");
  const infoType = url.searchParams.get("type") || "specs";

  if (!productName)
    return Response.json({ status: 404, data: "Name not set as param" });

  try {
    const devices = await search.search(productName);
    switch (infoType) {
      case "specs":
        if (Array.isArray(devices) && devices.length > 0) {
          const specsArray = devices.map((device) =>
            catalog.getDevice(device?.id)
          );
          const resolvedSpecsArray = await Promise.all(specsArray);

          if (resolvedSpecsArray) {
            return Response.json({
              status: 200,
              data: {
                resolvedSpecsArray,
              },
            });
          }
          break;
        }

      case "description":
        if (Array.isArray(devices) && devices.length > 0) {
          const descriptions = devices.map((device) => {
            return { name: device?.name, description: device?.description };
          });
          if (descriptions) {
            return Response.json({
              status: 200,
              data: {
                descriptions,
              },
            });
          }
        }
        break;

      default:
        return Response.json({ status: 404, data: "No info for this product" });
    }
    return Response.json({ status: 404, data: "No info for this product" });
  } catch (err) {
    if (err) {
      console.log(getErrorMessage(err));
      return Response.json({ error: getErrorMessage(err), status: 500 });
    }
  }
}
