SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


-- =============================================
CREATE PROCEDURE [dbo].[GetCRWNotes]
(
@CID int,
@BudgetID int,
@BudgetFileID int,
@BudgetCategoryID int,
@AccountNumber varchar(50),
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

		declare @BudgetAccountID varchar(50);

	select @BudgetAccountID=a.BudgetAccountID from BudgetAccounts as a inner join BudgetCategory as b on a.CategoryId=b.cid
inner join BudgetFile as c on a.BudgetFileID=c.BudgetFileID
where b.BudgetCategoryID=@BudgetCategoryID and a.BudgetID=@BudgetID and a.BudgetFileID=@BudgetFileID and a.AccountNumber=@AccountNumber
and c.CompanyID=@CID;


select b.Name,@UserID as LoginUserID,a.UserID, a.CRWNotesID,a.BudgetAccountID,a.Notes,convert(varchar(10),a.NoteDate,101)as Ndate,a.Status from
  CRWNotes as a inner join CAUsers as b on a.UserID=b.UserID  where a.BudgetAccountID=@BudgetAccountID and a.Status='Public'
  union all
  (
  select b.Name,@UserID as LoginUserID,a.UserID,a.CRWNotesID,a.BudgetAccountID,a.Notes,convert(varchar(10),a.NoteDate,101)as Ndate,a.Status from
  CRWNotes as a inner join CAUsers as b on a.UserID=b.UserID where a.BudgetAccountID=@BudgetAccountID and a.Status='Private' and a.UserID=@UserID
  ) order by CRWNotesID

END




GO