//@ts-ignore
import { getErrorMessage } from "@/utils/getErrorMessage";

export const fetchProductDescription = async (name: string | undefined) => {
  if (!name) return;
  try {
    const response = await fetch(
      `/api/gsmarena?${new URLSearchParams({ name })}`,
      { method: "GET" }
    );
    const { data } = await response.json();
    if (data) {
      const description = data.description && JSON.stringify(data.description);

      const quickSpec =
        data.quickSpec &&
        JSON.stringify(
          data.quickSpec.reduce(
            (acc: {}, el: { name: string; value: string }) => {
              return { ...acc, [el["name"]]: el["value"] };
            },
            {}
          )
        );
      const imgLink = data.imgLink && JSON.stringify(data.imgLink);

      const html =
        (description ? `DESCRIPTION: ${description} <br><br><br>` : "") +
        (quickSpec
          ? `QUICKSPEC: ${quickSpec}<br><br><br>`.replace("\n", "")
          : "") +
        (imgLink ? `IMG LINK: ${imgLink}<br>` : "");
      return html;
    }
  } catch (err) {
    return console.log(getErrorMessage(err));
  }
};
