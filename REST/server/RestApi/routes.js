const router = require('express').Router();
const RestApi = require('./api');

const checkAuth = require('../middleware/check-auth');
const studentAuth = checkAuth.checkStudent;
const teacherAuth = checkAuth.checkTeacher;
const adminAuth = checkAuth.checkAdmin;
const auth = checkAuth.checkAuth;
const studentTeacherAuth = checkAuth.checkStudentTeacher;

/*----------------------------------VRSTE KORISNIKA------------------------------------*/

router.get('/vrsteKorisnika', RestApi.GetUserTypes);
router.get('/vrsteKorisnika/:id', RestApi.GetUserTypeById);
router.get('/vrsteKorisnika/:id/korisnici', RestApi.GetUsersByUserTypeId);

/*-----------------------------------VRSTE ISPITA---------------------------------------*/

router.get('/vrsteIspita', auth, RestApi.GetExamTypes);
router.get('/vrsteIspita/:id', RestApi.GetExamTypeById);
router.get('/vrsteIspita/:id/ispiti', RestApi.GetExamsByExamTypeId);

/*------------------------------------PRIVILEGIJE--------------------------------------*/

router.put('/privilegije/:id', adminAuth, RestApi.EditPrivilegeById);
router.delete('/privilegije/:id', adminAuth, RestApi.DeletePrivilegeById);
router.get('/privilegije/:id', auth, RestApi.GetPrivilegeById);

/*-------------------------------------EMAILOVI----------------------------------------*/

router.delete('/emails/:id', auth, RestApi.DeleteEmailById);
router.put('/emails/:id', auth, RestApi.EditEmailById);
router.get('/emails/:id/korisnik', auth, RestApi.GetPersonByEmailId);

/*-------------------------------------NALOG---------------------------------------*/

router.get('/nalozi/:id/korisnik', adminAuth, RestApi.GetPersonByAccountId);
router.get('/nalozi/:id', adminAuth, RestApi.GetAccountById);

/*-------------------------------------KORISNICI---------------------------------------*/

router.post('/login', RestApi.Login);
router.post('/register', RestApi.RegisterPerson);

router.get('/korisnici/prijavljeniKorisnik', auth, RestApi.GetLoggedInUser);
router.get('/korisnici/prijavljeniKorisnik/nalog', auth, RestApi.GetLoggedInUserAccount);
router.get('/korisnici/prijavljeniKorisnik/emails', auth, RestApi.GetLoggedInUserEmails);
router.get('/korisnici/prijavljeniKorisnik/privilegije', auth, RestApi.GetLoggedInUserPrivilege);

router.get('/korisnici', adminAuth, RestApi.GetUsers);
router.get('/search/korisnici/:vrsta', adminAuth, RestApi.GetUsersByType);
router.get('/search/korisnici', adminAuth, RestApi.GetPersonByUsername);
router.get('/korisnici/:id', adminAuth, RestApi.GetUserById);
router.get('/korisnici/:id/nalog', adminAuth, RestApi.GetAccountByPersonId);
router.get('/korisnici/:id/emails', adminAuth, RestApi.GetEmailsByPersonId);
router.get('/korisnici/:id/privilegije', adminAuth, RestApi.GetPrivilegesByPersonId);
router.post('/korisnici/:id/privilegije', adminAuth, RestApi.AssignPrivilege);
router.delete('/korisnici/:id', adminAuth, RestApi.DeleteUserByID);
router.put('/korisnici/:id/verifikacija', adminAuth, RestApi.VerifyUserById);

router.put('/korisnici/username', auth, RestApi.ChangeUsername);
router.post('/korisnici/emails', auth, RestApi.CreateEmails);
router.put('/korisnici/password', auth, RestApi.ChangePassword);
router.put('/korisnici/podaci', auth, RestApi.ChangePersonalData);

router.get('/studenti', teacherAuth, RestApi.GetStudents);
router.get('/search/studenti', teacherAuth, RestApi.GetStudentByUsername);
router.get('/studenti/ispitBodovi', studentAuth, RestApi.GetMyExamPoints);
router.get('/studenti/spiralaBodovi', studentAuth, RestApi.GetMyHomeworkPoints);
router.get('/studenti/repozitoriji/:id', studentAuth, RestApi.GetMyRepositoryById);
router.get('/studenti/repozitoriji', studentAuth, RestApi.GetMyRepositories);
router.get('/studenti/grupe', studentAuth, RestApi.GetMyGroups);
router.get('/studenti/:id', teacherAuth, RestApi.GetStudentById);
router.get('/studenti/:id/repozitoriji', teacherAuth, RestApi.GetRepositoriesByPersonId);
router.get('/studenti/:id/izvjestaji', teacherAuth, RestApi.GetReportsByPersonId);
router.get('/studenti/:id/grupe', teacherAuth, RestApi.GetGroupsByPersonId);
router.get('/studenti/:id/emails', teacherAuth, RestApi.GetEmailsByStudentId);
router.get('/studenti/:id/nalog', teacherAuth, RestApi.GetAccountByStudentId);
router.get('/studenti/:id/privilegije', teacherAuth, RestApi.GetPrivilegesByStudentId);

/*-------------------------------------IZVJEŠTAJI--------------------------------------*/

router.post('/izvjestaji', teacherAuth, RestApi.CreateReport);
router.post('/izvjestaji/grupno', teacherAuth, RestApi.CreateReports);
router.delete('/izvjestaji/:id', teacherAuth, RestApi.DeleteReportById);
router.get('/izvjestaji', teacherAuth, RestApi.GetReports);
router.get('/izvjestaji/:id', teacherAuth, RestApi.GetReportById);
router.get('/search/izvjestaji/spirala/:id', teacherAuth, RestApi.GetReportsByHomeworkId);
router.get('/search/izvjestaji/student/:id', teacherAuth, RestApi.GetReportsByPersonId);
router.get('/izvjestaji/:id/komentari', teacherAuth, RestApi.GetCommentsByReportId);

/*-------------------------------------KOMENTARI---------------------------------------*/

router.get('/komentari', studentAuth, RestApi.GetCommentByParameters);
router.get('/komentari/spirala/:id', studentAuth, RestApi.GetReceivedComments);
router.delete('/komentari/:id', studentAuth, RestApi.DeleteComment);
router.put('/komentari/:id', studentAuth, RestApi.EditCommentById);
router.post('/komentari', studentAuth, RestApi.CreateComment);

/*-------------------------------------REVIEWS------------------------------------------*/

router.post('/reviews', studentAuth, RestApi.CreateReview);
router.delete('/reviews/spirala/:id', studentAuth, RestApi.DeleteReviewByHomeworkId);

/*-------------------------------------SPIRALE------------------------------------------*/

router.post('/spirale', teacherAuth, RestApi.CreateHomework);
router.get('/spirale', studentTeacherAuth, RestApi.GetHomeworks);
router.put('/spirale/:id', teacherAuth, RestApi.EditHomeworkById);
router.get('/search/spirale/broj/:broj', studentTeacherAuth, RestApi.GetHomeworksByNumber);
router.get('/search/spirale/godina/:godina([^/]+/[^/]+)', studentTeacherAuth, RestApi.GetHomeworksByYear);
router.get('/spirale/:id', studentTeacherAuth, RestApi.GetHomeworkById);
router.get('/spirale/:id/semestar', studentTeacherAuth, RestApi.GetSemesterByHomeworkId);
router.get('/spirale/:id/spisak', studentTeacherAuth, RestApi.GetListByHomeworkId);
router.delete('/spirale/:id', teacherAuth, RestApi.DeleteHomework);

/*-------------------------------------REPOZITORIJI--------------------------------------*/

router.post('/repozitoriji', studentAuth, RestApi.CreateRepository);
router.put('/repozitoriji/:id', studentAuth, RestApi.EditRepositoryById);
router.delete('/repozitoriji/:id', studentAuth, RestApi.DeleteRepositoryById);
router.get('/repozitoriji/:id', teacherAuth, RestApi.GetRepositoryById);
router.get('/repozitoriji', teacherAuth, RestApi.GetRepositories);
router.get('/repozitoriji/:id/student', teacherAuth, RestApi.GetPersonByRepositoryId);

/*-------------------------------------SPISKOVI---------------------------------------*/

router.post('/spiskovi', teacherAuth, RestApi.CreateList);
router.put('/spiskovi', teacherAuth, RestApi.EditList);
router.delete('/spiskovi', teacherAuth, RestApi.DeleteList);
router.get('/search/spiskovi', teacherAuth, RestApi.SearchListByHomeworkId);
router.get('/spiskovi', teacherAuth, RestApi.GetLists);
router.get('/spiskovi/:id', teacherAuth, RestApi.GetListById);

/*-------------------------------------AKADEMSKE GODINE------------------------------------*/

router.post('/akademskeGodine', teacherAuth, RestApi.CreateAcademicYear);
router.put('/akademskeGodine/:id', teacherAuth, RestApi.EditAcademicYearById);
router.get('/akademskeGodine', studentTeacherAuth, RestApi.GetAcademicYears);
router.get('/search/akademskeGodine', studentTeacherAuth, RestApi.GetAcademicYearsByName);
router.get('/akademskeGodine/trenutna', studentTeacherAuth, RestApi.GetCurrentAcademicYear);
router.get('/akademskeGodine/:id', studentTeacherAuth, RestApi.GetAcademicYearById);
router.get('/akademskeGodine/:id/semestri', studentTeacherAuth, RestApi.GetSemestersByAcademicYearId);
router.delete('/akademskeGodine/:id', teacherAuth, RestApi.DeleteAcademicYearById);

/*-------------------------------------SEMESTRI---------------------------------------*/

router.post('/semestri', teacherAuth, RestApi.CreateSemester);
router.put('/semestri/:id', teacherAuth, RestApi.EditSemesterById);
router.get('/semestri', studentTeacherAuth, RestApi.GetSemesters);
router.get('/semestri/:id', studentTeacherAuth, RestApi.GetSemesterById);
router.get('/semestri/:id/grupe', studentTeacherAuth, RestApi.GetGroupsBySemesterId);
router.get('/semestri/:id/spirale', studentTeacherAuth, RestApi.GetHomeworksBySemesterId);
router.get('/semestri/:id/ispiti', studentTeacherAuth, RestApi.GetExamsBySemesterId);
router.get('/semestri/:id/akademskaGodina', studentTeacherAuth, RestApi.GetAcademicYearBySemesterId);
router.delete('/semestri/:id', teacherAuth, RestApi.DeleteSemester);

/*-------------------------------------GRUPE------------------------------------------*/

router.post('/grupe', teacherAuth, RestApi.CreateGroup);
router.put('/grupe/:id', teacherAuth, RestApi.EditGroupById);
router.delete('/grupe/:id/studenti', teacherAuth, RestApi.DeleteGroupsStudentsByGroupId);
router.put('/grupe/:id/studenti', teacherAuth, RestApi.EditGroupsStudentsByGroupId);
router.get('/grupe/:id', studentTeacherAuth, RestApi.GetGroupById);
router.get('/grupe/:id/semestar', studentTeacherAuth, RestApi.GetSemesterByGroupId);
router.get('/grupe/:id/studenti', studentTeacherAuth, RestApi.GetGroupsStudents);
router.get('/grupe', studentTeacherAuth, RestApi.GetGroups);
router.get('/search/grupe', studentTeacherAuth, RestApi.GetGroupsByName);
router.get('/search/grupe/godina/:godina([^/]+/[^/]+)', studentTeacherAuth, RestApi.GetGroupsByYear);
router.delete('/grupe/:id', teacherAuth, RestApi.DeleteGroupById);

/*-------------------------------------ISPITI------------------------------------------*/

router.get('/search/ispiti/vrsta/:vrsta', studentTeacherAuth, RestApi.GetExamsByType);
router.get('/ispiti/:id', studentTeacherAuth, RestApi.GetExamById);
router.get('/ispiti', studentTeacherAuth, RestApi.GetExams);
router.get('/search/ispiti/godina/:godina([^/]+/[^/]+)', studentTeacherAuth, RestApi.GetExamsByYear);
router.post('/ispiti', teacherAuth, RestApi.CreateExam);
router.put('/ispiti/:id', teacherAuth, RestApi.EditExamById);
router.get('/ispiti/:id/semestar', studentTeacherAuth, RestApi.GetSemesterByExamId);
router.get('/ispiti/:id/vrstaIspita', studentTeacherAuth, RestApi.GetExamTypeByExamId);
router.delete('/ispiti/:id', teacherAuth, RestApi.DeleteExamById);

/*-------------------------------------ISPIT BODOVI------------------------------------------*/

router.get('/ispitBodovi/ispit/:id', studentTeacherAuth, RestApi.GetExamPointsByExamId);
router.get('/ispitBodovi', studentTeacherAuth, RestApi.GetExamPoints);
router.get('/ispitBodovi/:id', studentTeacherAuth, RestApi.GetExamPointsById);
router.get('/ispitBodovi/:id/student', studentTeacherAuth, RestApi.GetStudentByExamPointsId);
router.get('/ispitBodovi/:id/ispit', studentTeacherAuth, RestApi.GetExamByExamPointsId);
router.get('/ispitBodovi/student/:id', teacherAuth, RestApi.GetExamPointsByStudentId);
router.post('/ispitBodovi/grupno', teacherAuth, RestApi.CreateExamPoints);
router.post('/ispitBodovi', teacherAuth, RestApi.CreateOneExamPoints);
router.put('/ispitBodovi/:id', teacherAuth, RestApi.EditExamPointsById);
router.delete('/ispitBodovi/grupno', teacherAuth, RestApi.DeleteExamPoints);
router.delete('/ispitBodovi/:id', teacherAuth, RestApi.DeleteExamPointsById);

/*-------------------------------------SPIRALA BODOVI------------------------------------------*/

router.get('/spiralaBodovi/spirala/:id', studentTeacherAuth, RestApi.GetHomeworkPointsByHomeworkId);
router.get('/spiralaBodovi/:id', studentTeacherAuth, RestApi.GetHomeworkPointsById);
router.get('/spiralaBodovi', studentTeacherAuth, RestApi.GetHomeworkPoints);
router.get('/spiralaBodovi/:id/student', studentTeacherAuth, RestApi.GetStudentByHomeworkPointsId);
router.get('/spiralaBodovi/:id/spirala', studentTeacherAuth, RestApi.GetHomeworkByHomeworkPointsId);
router.get('/spiralaBodovi/student/:id', teacherAuth, RestApi.GetHomeworkPointsByStudentId);
router.post('/spiralaBodovi/grupno', teacherAuth, RestApi.CreateHomeworkPoints);
router.post('/spiralaBodovi', teacherAuth, RestApi.CreateOneHomeworkPoints);
router.put('/spiralaBodovi/:id', teacherAuth, RestApi.EditHomeworkPointsById);
router.delete('/spiralaBodovi/grupno', teacherAuth, RestApi.DeleteHomeworkPoints);
router.delete('/spiralaBodovi/:id', teacherAuth, RestApi.DeleteHomeworkPointsById);

module.exports = router;