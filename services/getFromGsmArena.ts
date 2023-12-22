//@ts-ignore
import { getErrorMessage } from "@/utils/getErrorMessage";

type SpecsArrType = {
  description?: string;
  quickSpec?: { name: string; value: string }[];
  img?: string;
  name?: string;
}[];
type DescriptionArrType = {
  name?: string;
  description?: string;
  // id?: string;
  // img?: string;
}[];

export const fetchProductInfo = async (
  name: string | undefined,
  type: "specs" | "description"
) => {
  if (!name || !type) return;

  try {
    const response = await fetch(
      `/api/gsmarena?${new URLSearchParams({ name, type })}`,
      { method: "GET" }
    );
    const result = await response.json();
    const styling = 'style="color:#306c8a; font-weight:bold;"';

    switch (type) {
      case "specs":
        const specsArr: SpecsArrType = result?.data.resolvedSpecsArray;

        if (Array.isArray(specsArr) && specsArr.length) {
          const devicesHtmlArr = specsArr.map((el) => {
            const description =
              el.description && JSON.stringify(el.description);

            const name = el?.name;

            const quickSpec =
              el.quickSpec &&
              JSON.stringify(
                el.quickSpec.reduce(
                  (acc: {}, el: { name: string; value: string }) => {
                    return { ...acc, [el["name"]]: el["value"] };
                  },
                  {}
                )
              );
            const imgLink = el.img && JSON.stringify(el.img);

            const html =
              (name ? `<span ${styling}>NAME:</span> ${name} <br>` : "") +
              (description
                ? `<span ${styling}>DESCRIPTION:</span> ${description} <br>`
                : "") +
              (quickSpec
                ? `<span ${styling}>QUICKSPEC:</span> ${quickSpec}<br>`.replace(
                    "\n",
                    ""
                  )
                : "") +
              (imgLink
                ? `<span ${styling}>IMG LINK:</span> ${imgLink}<br>`
                : "");
            +"<br><br><br>";
            return html;
          });
          return devicesHtmlArr;
        }
      case "description":
        const descrArr: DescriptionArrType = result?.data.descriptions;
        if (Array.isArray(descrArr) && descrArr.length) {
          const descriptionHtmlArr = descrArr.map((el) => {
            return `<span ${styling}>NAME:</span> ${el.name} <br> <span ${styling}>DESCRIPTION:</span> ${el.description} <br>`;
          });
          return descriptionHtmlArr;
        }
    }
  } catch (err) {
    return console.log(getErrorMessage(err));
  }
};
