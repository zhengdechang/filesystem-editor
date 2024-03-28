import ProjectTemplate from "services/projects/ProjectTemplate.class";
import { MaterialsFileType } from "stores/materialsStore";

const code = `welcome to editor.
`;

class EmptyI7ProjectTemplate extends ProjectTemplate {
  id = "inform7";
  name = "Empty project";

  files = [
    {
      contents: code,
      displayName: "editor.md",
      id: "editor",
      locked: false,
      name: "editor.md",
      type: MaterialsFileType.code,
    },
  ];

  initialCursorPosition = { column: 1, lineNumber: 4 };
}

export default new EmptyI7ProjectTemplate();
