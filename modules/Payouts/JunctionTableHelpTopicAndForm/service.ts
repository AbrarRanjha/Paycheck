import BaseService from "../../Base/baseService";
import Agent from "../../Admin_Module/AgentTab/Agent/Model";
import Team from "../../Admin_Module/AgentTab/Team/Model";
import JunctionModel from "./Model";

class JTOfHelpTopicAndForm extends BaseService {
  public getOne = async (id: number) => {
    const user = await this.model.findOne({
      where: { purchaseRequisitionId: id },
      include: [
        {
          model: Team,
          as: "Team",
          //   through: JunctionTableOfSupplierAndPR,
        },
      ],
    });
    return user;
  };
  public updateTeamMembers = async (TeamId: number, data: any) => {
    console.log(TeamId, data);

    const user = await this.model.update(data, {
      where: {
        TeamId,
      },
      individualHooks: true,
    });
    console.log("user", user);

    return user[1][0];
  };
  public deleteByTeamId = async (TeamId: number) => {
    return await this.model.destroy({ where: { TeamId } });
  };
  public deleteByAgentId = async (AgentId: number) => {
    return await this.model.destroy({ where: { AgentId } });
  };
}

export const instance = new JTOfHelpTopicAndForm(JunctionModel);

export default JTOfHelpTopicAndForm;
