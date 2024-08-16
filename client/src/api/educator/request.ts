import { url } from "@port-of-mars/client/util";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";
import {
  StudentAuthData,
  InspectData,
  StudentData,
  ClassroomData,
} from "@port-of-mars/shared/types";

export class EducatorAPI {
  http: any;
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async authStudent(): Promise<StudentAuthData | void> {
    return await this.ajax.get(url("/educator/student"), ({ data }) => {
      return data;
    });
  }

  async confirmStudent(formData: { name: string }) {
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
  }

  async createClassroom(descriptor: string): Promise<void> {
    const payload = { descriptor };
    console.log("Sending payload:", payload);
    return await this.ajax.post(
      url("/educator/classroom"),
      ({ data, status }) => {
        if (status === 201) {
          return data;
        } else {
          throw new Error(data.message || "Classroom creation failed");
        }
      },
      payload
    );
  }

  async getClassrooms() {
    return await this.ajax.get(url("/educator/classrooms"), ({ data, status }) => {
      return data;
    });
  }

  async updateClassroom(classroomId: number, descriptor: string) {
    return await this.ajax.update(
      url(`/educator/classroom?classroomId=${classroomId}`),
      ({ data, status }) => {
        if (status === 200) {
          return data;
        } else {
          throw new Error(data.message || "Classroom renaming failed");
        }
      },
      { descriptor }
    );
  }

  async deleteClassroom(classroomId: number) {
    return await this.ajax.delete(
      url(`/educator/classroom?classroomId=${classroomId}`),
      ({ data, status }) => {
        return data;
      }
    );
  }

  async startGames(classroomId: number): Promise<any> {
    const payload = { classroomId };

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
  }

  async getClassroomGames(classroomId: number): Promise<any> {
    return await this.ajax.get(
      url(`/educator/classroom-games?classroomId=${classroomId}`),
      ({ data, status }) => {
        return data;
      }
    );
  }

  async getInspectData(roomId: string): Promise<InspectData> {
    return await this.ajax.get(
      url(`/educator/inspect-room?roomId=${roomId}`),
      ({ data, status }) => {
        return data;
      }
    );
  }

  async getClassroomStudents(classroomId: number): Promise<Array<StudentData>> {
    return await this.ajax.get(
      url(`/educator/students?classroomId=${classroomId}`),
      ({ data, status }) => {
        return data;
      }
    );
  }

  async getLobbyClients(classroomId: number): Promise<Array<StudentData>> {
    return await this.ajax.get(
      url(`/educator/lobby-clients?classroomId=${classroomId}`),
      ({ data, status }) => {
        return data;
      }
    );
  }

  async getCompletedGames(classroomId: number): Promise<any> {
    return await this.ajax.get(
      url(`/educator/completed-games?classroomId=${classroomId}`),
      ({ data, status }) => {
        return data;
      }
    );
  }
}
