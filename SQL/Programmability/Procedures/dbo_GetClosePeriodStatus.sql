-- =============================================
CREATE PROCEDURE [dbo].[GetClosePeriodStatus] 
@CompanyId int,
@ClosePeriodID int

AS
BEGIN
	
	SET NOCOUNT ON;


	select * from ClosePeriod where CompanyId = @CompanyId and ClosePeriodID=@ClosePeriodID
END