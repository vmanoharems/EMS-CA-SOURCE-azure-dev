SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetBudgetDetail] --GetBudgetDetail 2 ,1
(
@Budgetid int,
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @tz varchar(50);
	if exists(select * from TimeZone where UserID=@UserID)
	begin
	select @tz=TimeDifference from TimeZone where UserID=@UserID 	
	end
	else
	begin
	set @tz='00:00'
	end 



    select convert(varchar(10),([a].[Uploadeddate])-cast(@tz as datetime),101)as Uploadeddate,isnull(b.Name,'EMS') as Name,
	a.Action,a.Amounts,a.Status,
   'USD' as Currency,a.CompanCode,a.S2,a.S3,a.S4,a.S5,a.S6, a.BudgetFileID
 from BudgetFile as a left join CAUsers as b on a.uploadedby=b.UserID where a.Budgetid=@Budgetid
 
 
END



GO