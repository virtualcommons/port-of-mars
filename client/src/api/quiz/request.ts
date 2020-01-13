import { Room } from 'colyseus.js';
import { QuizRequests, GradeQuiz } from 'shared/quizLobby/requests';

export class QuizRequestAPI {
  room!: Room;

  connect(room: Room) {
    this.room = room;
  }

  public send(req: QuizRequests) {
    this.room.send(req);
  }

  public submitQuiz(answers: Array<number>) {
    const msg: GradeQuiz = {
      kind: 'grade-quiz',
      answers
    };
    this.send(msg);
  }
}
