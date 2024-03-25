/*
 * @Description: 
 * @Author: Devin
 * @Date: 2024-03-19 10:06:32
 */
import ProjectService from "./ProjectService.class";

import inform7VanillaProjectService from "./inform7/inform7VanillaProjectService";

/**
 * This is the list of all project options available in the New Project page.
 *
 * If there is only one project service in this list, and that project has only
 * one template, the New Project page is skipped and that project starts automatically.
 */
const projectServiceList: ReadonlyArray<ProjectService> = [
  inform7VanillaProjectService,
];

export default projectServiceList;
