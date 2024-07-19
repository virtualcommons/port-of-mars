import { url } from "@port-of-mars/client/util";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";
import { StudentAuthData } from "@port-of-mars/shared/types";

export class EducatorAPI {
  http: any;
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async authTeacher(): Promise<boolean> {
    return true; //FIXME: needs to be implemented on the server
    try {
      return await this.ajax.get(url("/educator/authenticate-teacher"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to authenticate user");
      console.log(e);
      throw e;
    }
  }

  async authStudent(): Promise<StudentAuthData | void> {
    try {
      return await this.ajax.get(url("/educator/student"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to authenticate student");
      console.log(e);
      throw e;
    }
  }

  async confirmStudent(formData: { name: string }) {
    try {
      await this.ajax.post(
        url("/educator/confirm-student"),
        ({ data, status }) => {
          if (status === 200) {
            return data;
          } else {
            throw new Error(data.message || "Student confirmation failed");
          }
        },
        formData
      );
    } catch (e) {
      console.log("Unable to confirm student");
      console.log(e);
      throw e;
    }
  }

  async createClassroom(descriptor: string): Promise<any>{
    const payload = { descriptor };
    console.log("Sending payload:", payload);
    try {
      return await this.ajax.post(
        url("/educator/classroom"), ({data, status}) => {
          if (status === 201){
            return data;
          } else {
            throw new Error(data.message || "Classroom creation failed");
          }
        }, payload
      );
    } catch (e) {
      console.log("Unable to create classroom");
      console.log(e);
      throw e;
    }
  }


  async getClassrooms() {
    try {
      return await this.ajax.get(
        url("/educator/classrooms"), ({data, status}) => {
          return data;
        }
      );
    } catch (e) {
      console.log("Unable to get classrooms");
      console.log(e);
      throw e;
    }
  }

  async updateClassroom(classroomId: number, descriptor: string){
    try {
      return await this.ajax.update(
        url("/educator/classroom"),
        ({data, status}) => {
          if (status === 200){
            return data;
          } else {
            throw new Error(data.message || "Classroom renaming failed");
          }
        }, {classroomId, descriptor}
      );
    } catch (e) {
      console.log("Unable to update classroom");
      console.log(e);
      throw e;
    }
  }

  async deleteClassroom(classroomId: number) {
    try {
      return await this.ajax.delete(
        url("/educator/classroom"), 
        ({data, status}) => {
          return data;
        }, 
        {classroomId}
      );
      console.log("Classroom deleted successfully");
    } catch (e) {
      console.log("Unable to delete classroom");
      console.log(e);
      throw e;
    }
  }

  async startGames(classroomId: number): Promise<any> {
    const payload = { classroomId };
    try {
      return await this.ajax.post(
        url("/educator/start-classroom-games"),
        ({ data, status }) => {
          if (status === 200) {
            return data;
          } else {
            throw new Error(data.message || "games failed to start");
          }
        },
        payload
      );
    } catch (e) {
      console.log("unable to start games");
      console.log(e);
      throw e;
    }
  }

  async getClassroomGames(classroomId: number): Promise<any> {
    try {
      return await this.ajax.get(
        url(`/educator/classroom-games?classroomId=${classroomId}`),
        ({ data, status }) => {
          if (status === 200){
            return data;
          } else {
            throw new Error(data.message || "failed to fetch classroom games");
          }
        }
      );
    } catch (e) {
      console.log("unable to get classroom's active games");
      console.log(e);
      throw e;
    }
  }
}
