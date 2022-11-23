SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetCRWNotesNew]
(
@COAID int,
@BudgetID int,
@BudgetFileID int,
@ProdID int,
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	
select b.Name,@UserID as LoginUserID,a.UserID, a.CRWNotesID,a.COAID,a.Notes,
convert(varchar(10),a.NoteDate,101)as Ndate,a.Status from
  CRWNotesNew as a inner join CAUsers as b on a.UserID=b.UserID  where a.COAID=@COAID and a.BudgetID=@BudgetID 
  and a.BudgetfileID=@BudgetFileID and a.Status='Public'
  union all
  (
  select b.Name,@UserID as LoginUserID,a.UserID,a.CRWNotesID,a.COAID,a.Notes,
  convert(varchar(10),a.NoteDate,101)as Ndate,a.Status from
   CRWNotesNew as a inner join CAUsers as b on a.UserID=b.UserID  where a.COAID=@COAID and a.BudgetID=@BudgetID 
  and a.BudgetfileID=@BudgetFileID
  and a.Status='Private' and a.UserID=@UserID
  ) order by CRWNotesID

END





GO